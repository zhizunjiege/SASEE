const { express, multer, path, 'node-schedule': schedule, exceljs: ExcelJs } = superApp.requireAll(['express', 'multer', 'path', 'node-schedule', 'exceljs']),
    { mysql, file, util } = superApp.requireUserModules(['mysql', 'file', 'util']);

const CONFIG = file.readJson(__dirname + '/config/map.json');

const app = express();
app.use((req, res, next) => {
    res.errors = CONFIG.errors;
    next();
});

let TIMES = file.readJson(__dirname + '/config/time.json');
function save() {
    file.writeJson(__dirname + '/config/time.json', TIMES);
}
const CALLBACKS = {
    choose(param = 'open') {
        TIMES.choose.usable = param === 'open';
        save();
        console.log('切换选题状态为--' + param);
    },
    async draw() {
        let sql_query = 'SELECT id,target1,target2,target3 FROM bysj WHERE state="2-通过" AND student IS NULL AND (JSON_LENGTH(target1) OR JSON_LENGTH(target2) OR JSON_LENGTH(target3))';
        let conn = await mysql.transaction(),
            rst = await conn.find(sql_query),
            students = [];
        for (let i = 1; i <= 3; i++) {
            let k = `target${i}`;
            for (const j of rst) {
                if (!j.student && j[k].length) {
                    let s = 0;
                    do {
                        s = j[k][Math.floor(Math.random() * j[k].length)];
                    } while (students.indexOf(s) >= 0);

                    students.push(s);
                    j.student = s;
                }
                j[k] = null;
            }
        }
        let sql_update = 'UPDATE bysj SET target1=JSON_ARRAY(),target2=JSON_ARRAY(),target3=JSON_ARRAY(),student=? WHERE id=?';
        for (const i of rst) {
            await conn.find(sql_update, [i.student, i.id]);
        }
        await conn.commitPromise();
        console.log('抽签完成！');
    },
    async adjust() {
        let sql_query = 'SELECT GROUP_CONCAT(id) ids,`group` FROM student s WHERE NOT EXISTS (SELECT 1 FROM bysj b WHERE b.student=s.id) GROUP BY `group` ORDER BY `group`;SELECT GROUP_CONCAT(b.id) ids,t.`group` FROM bysj b INNER JOIN teacher t ON t.id=b.teacher WHERE b.student IS NULL GROUP BY t.`group` ORDER BY t.`group`';
        let conn = await mysql.transaction(),
            [students, projects] = await conn.find(sql_query);
        let s = {}, p = {}, rst = [];
        for (const i of projects) {
            p[i.group[0]] = i.ids.split(',');
        }
        for (const i of students) {
            let k = i.group[0], msg = '';
            s[k] = i.ids.split(',');
            if (k == '7') {
                let ids = [];
                for (const j of Object.values(p)) {
                    if (j) {
                        ids = [...ids, ...j];
                    }
                }
                p[k] = ids;
            }

            if (!p[k]) {
                msg = `方向-${i.group}-没有可供调剂的课题！剩余学生${s[k].length}人。`;
            } else if (p[k].length < s[k].length) {
                for (let j = 0; j < p[k].length; j++) {
                    rst[p[k][j]] = p[k][j];
                }
                p[k] = null;
                msg = `方向-${i.group}-课题不足！剩余学生${s[k].length - p[k].length}人。`;
            } else {
                for (let j = 0; j < s[k].length; j++) {
                    rst[p[k][j]] = s[k][j];
                }
                p[k] = p[k].splice(0, s[k].length);
                msg = `方向-${i.group}-全部调剂完成！剩余课题${p[k].length - s[k].length}个。`;
            }

            console.log(msg);
        }

        let sql_update = 'UPDATE bysj SET target1=JSON_ARRAY(),target2=JSON_ARRAY(),target3=JSON_ARRAY(),student=? WHERE id=?';
        for (const [k, v] of Object.entries(rst)) {
            await conn.find(sql_update, [v, k]);
        }

        await conn.commitPromise();
        console.log('调剂完成！');
    }
};
let JOBS = {};

app.get('/project-list', (req, res) => {
    let { length: limit, start: offset } = req.query,
        { uid, identity } = req.session,
        sql_query1 = 'SELECT b.id,title,teacher,t.`name`,SUBSTR(t.`group`,3) `group`,(IFNULL(JSON_LENGTH(b.target1),0)+IFNULL(JSON_LENGTH(b.target2),0)+IFNULL(JSON_LENGTH(b.target3),0)) chosen FROM bysj b INNER JOIN teacher t ON b.teacher=t.id INNER JOIN student s ON t.`group`=s.`group`||s.`group`="7-高工" WHERE s.id=? AND b.state="2-通过" AND b.student IS NULL ORDER BY b.id LIMIT ? OFFSET ?',
        sql_query2 = 'SELECT b.id,title,teacher,student,state,submitTime,lastModifiedTime,t1.`name`,t1.proTitle FROM bysj b INNER JOIN teacher t1 ON b.teacher=t1.id INNER JOIN teacher t2 ON t1.`group`=t2.`group` WHERE t2.id=? ORDER BY b.state,b.id LIMIT ? OFFSET ?';
    if (identity == 'student' && !TIMES.choose.usable) {
        res.json({
            status: true,
            projects: [],
            msg: '未到选题时间！'
        });
    } else {
        res.do(async () => {
            let projects = await mysql.find(identity == 'student' ? sql_query1 : sql_query2, [uid, Number(limit), Number(offset)]);
            res.json({
                status: true,
                projects
            });
        });
    }
});

app.get('/info-project', (req, res) => {
    let sql_query = `SELECT id,title,type,source,difficulty,weight,ability,requirement,introduction,materials,submitTime,lastModifiedTime${req.session.identity == 'admin' ? ',(SELECT schoolNum FROM teacher t WHERE t.id=b.teacher) teaNum,(SELECT schoolNum FROM student s WHERE s.id=b.teacher) stuNum' : ''} FROM bysj b WHERE id=?`;
    res.do(async () => {
        let [project] = await mysql.find(sql_query, req.query.id);
        res.json({
            status: true,
            project
        });
    });
});
app.get('/info-teacher', (req, res) => {
    let sql_query = 'SELECT `name`,gender,schoolNum,proTitle,SUBSTR(`group`,3) `group`,department,field,office,email,homepage,wechat,tel,resume FROM teacher WHERE id=?';
    res.do(async () => {
        let [teacher] = await mysql.find(sql_query, req.query.id);
        teacher = util.dataFilter(teacher, ['wechat', 'tel', 'homepage', 'resume', 'office', 'field']);
        res.json({
            status: true,
            teacher
        });
    });
});
app.get('/info-student', (req, res) => {
    let sql_query = 'SELECT `name`,gender,schoolNum,SUBSTR(`group`,3) `group`,`class`,specialty,postGraduate,email,homepage,wechat,tel,resume FROM student WHERE id=?';
    res.do(async () => {
        let [student] = await mysql.find(sql_query, req.query.id);
        student = util.dataFilter(student, ['wechat', 'tel', 'homepage', 'resume']);
        res.json({
            status: true,
            student
        });
    });
});

app.get('/project-chosen', (req, res) => {
    let { uid } = req.session,
        start = 'SELECT b.id,title,teacher,t.`name`,SUBSTR(`group`,3) `group`,(IFNULL(JSON_LENGTH(b.target1),0)+IFNULL(JSON_LENGTH(b.target2),0)+IFNULL(JSON_LENGTH(b.target3),0)) chosen FROM bysj b INNER JOIN teacher t ON b.teacher=t.id WHERE JSON_CONTAINS(b.target',
        end = ',CONCAT("",?))',
        sql_query = '';
    res.do(async () => {
        let projects = [];
        for (let i = 1; i <= 3; i++) {
            sql_query = start + i + end;
            let result = await mysql.find(sql_query, uid);
            if (result.length) projects.push(result[0]);
            else projects.push(null);
        }
        res.json({
            status: true,
            projects
        });
    });
});

app.get('/project-detail', (req, res) => {
    let { uid, identity } = req.session,
        sql_query1 = 'SELECT id,teacher FROM bysj WHERE student=?',
        sql_query2 = 'SELECT student FROM bysj WHERE id=?';
    res.do(async () => {
        if (identity == 'student') {
            let [rst] = await mysql.find(sql_query1, uid);
            if (!rst) {
                throw 21;
            }
            res.json({
                status: true,
                pid: rst.id,
                tid: rst.teacher
            });
        }
        else {
            let [rst] = await mysql.find(sql_query2, req.query.pid);
            res.json({
                status: true,
                sid: rst.student || -1
            });
        }
    });
});

app.get('/project-notice', (req, res) => {
    let { pid } = req.query,
        sql_query = 'SELECT notice FROM bysj WHERE id=?';
    res.do(async () => {
        let [{ notice: notices }] = await mysql.find(sql_query, pid);
        res.json({
            status: true,
            notices
        });
    });
});

app.get('/project-file', (req, res) => {
    let { pid } = req.query,
        sql_query = 'SELECT studentFiles,teacherFiles FROM bysj WHERE id=?';
    res.do(async () => {
        let [files] = await mysql.find(sql_query, pid);
        res.json({
            status: true,
            studentFiles: files.studentFiles,
            teacherFiles: files.teacherFiles
        });
    });
});

app.get('/project-manage', (req, res) => {
    let uid = req.session.uid,
        sql_query = 'SELECT proTitle FROM teacher WHERE id=?;SELECT id,title,submitTime,SUBSTR(state,3) state,(SELECT `name` FROM student s WHERE s.id=b.student) student FROM bysj b WHERE teacher=?';
    res.do(async () => {
        let [[{ proTitle }], projects] = await mysql.find(sql_query, [uid, uid]);
        res.json({
            status: true,
            projects,
            limit: CONFIG.maxProjects[proTitle] || 2
        });
    });
});

app.get('/project-confirm', (req, res) => {
    let { pid } = req.query,
        sql_query = 'SELECT target1,target2,target3 FROM bysj WHERE id=?';
    res.do(async () => {
        let [result] = await mysql.find(sql_query, pid);
        res.json({
            status: true,
            students: [...result.target1, ...result.target2, ...result.target3]
        });
    });
});

app.get('/project-statistics', (req, res) => {
    let { uid } = req.session,
        sql_query1 = 'SELECT `group` FROM teacher WHERE id=?',
        sql_query2 = 'SELECT name,gender,schoolNum,proTitle,email,(SELECT COUNT(*) FROM bysj WHERE teacher=t.id) submitted FROM teacher t WHERE `group`=? ORDER BY schoolNum;SELECT COUNT(*) totalStudents FROM student WHERE `group`=?;SELECT state,COUNT(*) count FROM bysj b INNER JOIN teacher t ON b.teacher=t.id WHERE t.`group`=? GROUP BY state';
    res.do(async () => {
        let [{ group }] = await mysql.find(sql_query1, uid),
            [teachers, [{ totalStudents }], stateCounts] = await await mysql.find(sql_query2, [group, group, group]);
        let ret = {
            status: true,
            teachers,
            map: CONFIG.maxProjects,
            totalStudents,
            pass: 0,
            uncheck: 0,
            unpass: 0
        };
        for (const i of stateCounts) {
            if (i.state == '0-未审核') ret.uncheck = i.count;
            if (i.state == '1-未通过') ret.unpass = i.count;
            if (i.state == '2-通过') ret.pass = i.count;
        }
        res.json(ret);
    });
});

app.post('/choose', (req, res) => {
    let { id, target } = req.body,
        { uid } = req.session;
    // ifFinal = req.fsm.now().name == 'final';//需考虑不同时期的选择
    let sql_query1 = `SELECT 1 FROM bysj WHERE student=?;SELECT 1 FROM bysj WHERE student IS NOT NULL AND id=?`,
        sql_query2 = `SELECT id,target${target} target FROM bysj WHERE JSON_CONTAINS(target${target},CONCAT("",?))`,
        sql_update1 = `UPDATE bysj SET target${target}=? WHERE id=?`,
        sql_update2 = `UPDATE bysj SET target${target}=JSON_ARRAY_APPEND(target${target},"$",?) WHERE id=?`;

    res.do(async () => {
        let [re1, re2] = await mysql.find(sql_query1, [uid, id]);
        if (re1.length) throw 10;
        if (re2.length) throw 11;
        let conn = await mysql.transaction(),
            re3 = await conn.find(sql_query2, uid);
        if (re3.length) {
            re3[0].target.remove(uid);
            await conn.find(sql_update1, [JSON.stringify(re3[0].target), re3[0].id]);
        }
        await conn.find(sql_update2, [uid, id]);
        await conn.commitPromise();
        res.json({
            status: true,
            msg: '选择课题成功！'
        });
    });
});

app.post('/revoke', (req, res) => {
    let { id, target } = req.body,
        { uid } = req.session,
        sql_query = `SELECT target${target} target FROM bysj WHERE id=?`,
        sql_update = `UPDATE bysj SET target${target}=? WHERE id=?`;
    res.do(async () => {
        let [{ target: tar }] = await mysql.find(sql_query, id);
        tar.remove(uid);
        await mysql.find(sql_update, [JSON.stringify(tar), id]);
        res.json({
            status: true,
            msg: '退选课题成功！'
        });
    });
});


const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, 'tmp'));
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    })
});

let receiver = upload.single('file');

app.post('/upload', receiver, (req, res) => {
    let { pid } = req.body,
        { identity, name } = req.session,
        { filename, path: from } = req.file,
        sql_update = '',
        param = [];
    if (identity == 'student') {
        sql_update = `UPDATE bysj SET studentFiles=JSON_ARRAY_INSERT(studentFiles,"$[0]",JSON_OBJECT("date",CURDATE(),"filename",?,"uploader",?)) WHERE id=?`;
        param = [filename, name, pid];
    }
    else {
        sql_update = `UPDATE bysj SET teacherFiles=JSON_ARRAY_INSERT(teacherFiles,"$[0]",JSON_OBJECT("date",CURDATE(),"filename",?)) WHERE id=?`;
        param = [filename, pid];
    }
    res.do(async () => {
        await mysql.find(sql_update, param);
        let to = path.resolve(__dirname, 'files', pid, identity, identity == 'student' ? name : '', filename);
        file.move(from, to, err => {
            if (err) {
                throw 22;
            }
            res.json({
                status: true,
                msg: '文件上传成功！'
            });
        });
    });
});

app.get('/download', (req, res) => {
    let { pid, filename, uploader } = req.query,
        { identity } = req.session,
        from = path.resolve(__dirname, 'files', pid, identity, uploader ? uploader : '', filename);
    res.do(async () => {
        res.download(from, err => {
            if (err) {
                throw 23;
            }
        });
    });
});

app.post('/submit', receiver, (req, res) => {
    let sql_insert = 'INSERT INTO bysj (submitTime,lastModifiedTime,studentFiles,teacherFiles,notice,target1,target2,target3,state,student,teacher,title,type,source,requirement,introduction,difficulty, weight,ability,materials) VALUES (CURDATE(),CURDATE(),JSON_ARRAY(),JSON_ARRAY(),JSON_ARRAY(),JSON_ARRAY(),JSON_ARRAY(),JSON_ARRAY(),"0-未审核",NULL,?,?,?,?,?,?,?,?,?,?)';
    let sql_update = 'UPDATE bysj SET ?,lastModifiedTime=CURDATE(),state="0-未审核" WHERE id=?';
    let { opt, info } = req.body,
        { uid, identity } = req.session;
    info = JSON.parse(info);
    let { id: pid, title, type, source, requirement, introduction, difficulty, weight, ability, materials, teaNum, stuNum } = info;
    res.do(async () => {
        if (opt == 'new') {
            let rst = await mysql.find(sql_insert, [uid, title, type, source, requirement, introduction, difficulty, weight, JSON.stringify(ability), materials]);
            pid = rst.insertId;
        }
        else {
            await mysql.find(sql_update, [{ title, type, source, requirement, introduction, difficulty, weight, ability: JSON.stringify(ability), materials }, pid]);
        }
        if (identity == 'admin') {
            let param = {},
                sql_query = 'SELECT id FROM ?? WHERE schoolNum=?',
                sql_update = 'UPDATE bysj SET ? WHERE id=?';
            [{ id }] = await mysql.find(sql_query, ['teacher', teaNum]);
            param.teacher = id;
            if (stuNum) {
                [{ id }] = await mysql.find(sql_query, ['student', stuNum]);
                param.student = id;
            }
            await mysql.find(sql_update, [param, pid]);
        }
        if (req.file) {
            let { filename, path: from } = req.file;
            let to = path.resolve(__dirname, 'files', '' + pid, 'teacher', filename);
            file.move(from, to, err => {
                if (err) {
                    throw 22;
                }
                res.json({
                    status: true,
                    msg: '操作成功！'
                });
            });
        }
        else {
            res.json({
                status: true,
                msg: '操作成功！'
            });
        }
    });
});

app.get('/remove', (req, res) => {
    let { pid } = req.query,
        sql_delete = 'DELETE FROM bysj WHERE id=?';
    res.do(async () => {
        await mysql.find(sql_delete, pid);
        res.json({
            status: true,
            msg: '删除成功！'
        });
    });
});

app.get('/confirm', (req, res) => {
    let { sid, pid } = req.query,
        sql_query = `SELECT id,target1 t FROM bysj WHERE JSON_CONTAINS(target1,"${sid}");SELECT id,target2 t FROM bysj WHERE JSON_CONTAINS(target2,"${sid}");SELECT id,target3 t FROM bysj WHERE JSON_CONTAINS(target3,"${sid}");`,
        sql_update1 = 'UPDATE bysj SET state="0-未审核",target1=JSON_ARRAY(),target2=JSON_ARRAY(),target3=JSON_ARRAY(),student=? WHERE id=?';
    res.do(async () => {
        let conn = await mysql.transaction();
        await conn.find(sql_update1, [sid, pid]);
        let rst = await conn.find(sql_query);
        for (const [i, v] of rst.entries()) {
            if (v.length) {
                v[0].t.remove(Number(sid));
                let sql_update2 = `UPDATE bysj SET target${i + 1}="${JSON.stringify(v[0].t)}" WHERE id=${v[0].id}`;
                await conn.find(sql_update2);
            }
        }
        await conn.commitPromise();

        res.json({
            status: true,
            msg: '选择成功！'
        });
    });
});

app.post('/notice', (req, res) => {
    let { content, title, pid } = req.body,
        sql_update = 'UPDATE bysj SET notice=JSON_ARRAY_INSERT(notice,"$[0]",JSON_OBJECT("date",CURDATE(),"title",?,"content",?)) WHERE id=?';
    res.do(async () => {
        await mysql.find(sql_update, [title, content, pid]);
        res.json({
            status: true,
            msg: '通知发布成功！'
        });
    });
});

app.post('/check', (req, res) => {
    let { pid, check } = req.body,
        sql_update = 'UPDATE bysj SET ? WHERE id=?';
    res.do(async () => {
        await mysql.find(sql_update, [{ state: check.ifPass ? '2-通过' : '1-不通过', check: JSON.stringify(check) }, pid]);
        res.json({
            status: true,
            msg: '审核结果提交成功！'
        });
    });
});


//admin
app.get('/truncate', (req, res) => {
    let sql_truncate = 'TRUNCATE TABLE bysj';
    res.do(async () => {
        await mysql.find(sql_truncate);
        res.json({
            status: true,
            msg: '数据全部删除成功！'
        });
    });
});

app.get('/stats', (req, res) => {
    let sql_query = 'SELECT `group`,COUNT(id) students FROM student GROUP BY `group` ORDER BY `group`;SELECT `group`,COUNT(id) teachers FROM teacher GROUP BY `group` ORDER BY `group`;SELECT t.`group`,b.state,COUNT(b.id) projects FROM bysj b,teacher t WHERE b.teacher=t.id GROUP BY t.`group`,b.state ORDER BY t.`group`,b.state;';
    res.do(async () => {
        let rst = await mysql.find(sql_query), stats = [];
        for (const [k, v] of rst[0].entries()) {
            stats[k] = {
                group: v.group.substr(2),
                students: v.students,
                teachers: 0,
                uncheck: 0,
                unpass: 0,
                pass: 0
            };
        }
        for (const [k, v] of rst[1].entries()) {
            stats[k].teachers = v.teachers;
        }
        for (const v of rst[2]) {
            stats[Number(v.group[0] - 1)][CONFIG.state[v.state]] = v.projects;
        }
        res.json({
            status: true,
            stats
        });
    });
});

app.get('/search', (req, res) => {
    let { name } = req.query,
        sql_query = 'SELECT b.id,title,SUBSTR(state,3) state,t.name,teacher,student FROM bysj b INNER JOIN teacher t ON b.teacher=t.id WHERE t.name=?';
    res.do(async () => {
        let projects = await mysql.find(sql_query, name);
        res.json({
            status: true,
            projects
        });
    });
});

app.post('/date', (req, res) => {
    let { times: t } = req.body;
    for (const [k, v] of Object.entries(t)) {
        TIMES[k].time = v.time;
    }
    for (const i of Object.values(JOBS)) {
        i.cancel();
    }
    for (const [k, v] of Object.entries(TIMES)) {
        schedule.scheduleJob(new Date(v.time), CALLBACKS[k]);
    }
    JOBS = schedule.scheduledJobs;
    save();
    res.json({
        status: true,
        msg: '日期设置成功！'
    });
});

app.get('/date-info', (req, res) => {
    res.json({
        status: true,
        times: TIMES
    });
});

app.get('/manual-operation', (req, res) => {
    res.do(async () => {
        await CALLBACKS[req.query.opt](req.query.param);
        res.json({
            status: true,
            msg: '操作成功!'
        });
    });
});

let excelWB = null, excelWS = null;
(async () => {
    excelWB = new ExcelJs.Workbook();
    await excelWB.xlsx.readFile(__dirname + '/config/template.xlsx');
    excelWS = excelWB.getWorksheet(1);
    for (const c of excelWS.columns) {
        c.width = 14;
    }
    excelWS.eachRow(function (row, index) {
        row.height = 20;
    });
})();

app.get('/export-excel', (req, res) => {
    let { pid } = req.query,
        sql_query = 'SELECT title,type,source,introduction,requirement,`check`,t.name teacher,t.department,t.proTitle,s.name student,s.schoolNum stuNum FROM bysj b INNER JOIN teacher t ON b.teacher=t.id INNER JOIN student s ON b.student=s.id WHERE b.id=?';
    res.do(async () => {
        let [data] = await mysql.find(sql_query, pid);
        excelWS.getCell('E3').value = data.department;
        excelWS.getCell('B4').value = data.teacher;
        excelWS.getCell('E4').value = data.proTitle;
        excelWS.getCell('B5').value = data.student;
        excelWS.getCell('E5').value = data.stuNum;
        excelWS.getCell('B6').value = data.title;
        excelWS.getCell('B7').value = data.type;
        excelWS.getCell('B8').value = data.source;
        excelWS.getCell('B9').value = data.introduction;
        excelWS.getCell('B12').value = data.requirement;
        excelWS.getCell('B16').value = data.check.ifClear ? '是' : '否';
        excelWS.getCell('B18').value = data.check.ifDifficultyProper ? '是' : '否';
        excelWS.getCell('B20').value = data.check.ifMeetGoal ? '是' : '否';
        excelWS.getCell('B22').value = data.check.ifConditionWell ? '是' : '否';
        excelWS.getCell('B24').value = data.check.ifPass ? '通过' : '不通过';
        let tmp = path.resolve(__dirname, 'tmp', `${(new Date()).getFullYear()}年本科生毕业设计（论文）题目申报表-${data.teacher}-${data.student}.xlsx`);
        await excelWB.xlsx.writeFile(tmp);
        res.download(tmp, err => {
            if (err) {
                throw 23;
            }
            file.unlink(tmp);
        });
    });
});

app.get('/export-table', (req, res) => {
    let sql_query = 'SELECT title,type,source,difficulty,weight,ability,introduction,requirement,t.name tname,t.gender tgender,t.schoolNum tnum,SUBSTR(t.`group`,3) tgroup,department,proTitle,s.name sname,s.gender sgender,specialty,s.schoolNum snum,SUBSTR(s.`group`,3) sgroup,`class`,postGraduate FROM bysj b INNER JOIN teacher t ON b.teacher=t.id INNER JOIN student s ON b.student=s.id WHERE b.student IS NOT NULL ORDER BY t.id';
    res.do(async () => {
        let table = await mysql.find(sql_query);
        for (const i of table) {
            Object.assign(i, i.ability);
            delete i.ability;
        }

        let tableWB = new ExcelJs.Workbook(), tableWS = tableWB.addWorksheet('sheet1');
        let style = {
            font: {
                name: '宋体',
                size: 10,
            },
            alignment: {
                vertical: 'middle',
                horizontal: 'center'
            }
        };
        tableWS.columns = [{ header: '毕业设计（论文）题目', key: 'title', width: 60, style }, { header: '题目类型', key: 'type', width: 12, style }, { header: '题目来源', key: 'source', width: 12, style }, { header: '题目难度', key: 'difficulty', width: 12, style }, { header: '题目份量', key: 'weight', width: 12, style }, { header: '解决问题综合能力要求', key: 'allRound', width: 12, style }, { header: '实验能力要求', key: 'experiment', width: 12, style }, { header: '绘图能力要求', key: 'graphic', width: 12, style }, { header: '数据处理能力要求', key: 'data', width: 12, style }, { header: '计算结果分析能力要求', key: 'analysis', width: 12, style }, { header: '题目简介', key: 'introduction', width: 60, style }, { header: '学生要求', key: 'requirement', width: 60, style }, { header: '教师姓名', key: 'tname', width: 12, style }, { header: '教师性别', key: 'tgender', width: 12, style }, { header: '教师职称', key: 'proTitle', width: 12, style }, { header: '教师工号', key: 'tnum', width: 12, style }, { header: '教师分组', key: 'tgroup', width: 20, style }, { header: '教师系别', key: 'department', width: 12, style }, { header: '学生姓名', key: 'sname', width: 12, style }, { header: '学生性别', key: 'sgender', width: 12, style }, { header: '学生专业', key: 'specialty', width: 20, style }, { header: '学生学号', key: 'snum', width: 12, style }, { header: '学生分组', key: 'sgroup', width: 20, style }, { header: '学生班级', key: 'class', width: 12, style }, { header: '学生是否保研', key: 'postGraduate', width: 12, style }];

        tableWS.addRows(table);
        tableWS.getRow(1).font = { name: '华文行楷', size: 12 };
        tableWS.eachRow(function (row, index) {
            row.height = 20;
        });

        let time = new Date();
        let tmp = path.resolve(__dirname, 'backup', `${time.getFullYear()}年本科生毕业设计（论文）题目汇总表-${time.toLocaleDateString()}.xlsx`);
        await tableWB.xlsx.writeFile(tmp);
        res.download(tmp, err => {
            if (err) {
                throw 23;
            }
        });
    });
});

function getComponentName(identity, component) {
    switch (component) {
        case 'project-list':
        case 'project-content':
        case 'project-detail':
        case 'project-form':
            component += `-${identity}`;
            break;
        default: ;
    }
    return component + '.js';
}

module.exports = { getComponentName, app, route: '/bysj' };