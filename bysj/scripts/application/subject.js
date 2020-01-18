const [mysql, file, util] = superApp.requireUserModules(['mysql', 'file', 'util']);
const errorMap = superApp.errorMap, { FILES } = superApp.resourses;

function query(req, res) {
    res.send('' + superApp.maxProjectsMap[req.session.proTitle]);
}

function submit(req, res) {
    let { title, introduction, type, source, requirement, difficulty, weight, password } = req.body,
        { allRound, experiment, graphic, data, analysis } = req.body,
        { group, account } = req.session,
        materials = req.file ? req.file.filename : '';

    introduction = introduction.replace(/\r/g, '');
    requirement = requirement.replace(/\r/g, '');
    let sql_query = 'SELECT id,proTitle,JSON_LENGTH(bysj) bysjNum FROM teacher WHERE account=? AND password=?',
        sql_insert = 'INSERT INTO bysj (submitTime,lastModifiedTime,studentFiles,teacherFiles,notice,student,state,title,`group`,introduction,materials,type, source, requirement, difficulty, weight, ability,teacher) VALUES (CURDATE(),CURDATE(),JSON_ARRAY(),JSON_ARRAY(),JSON_ARRAY(),NULL,"1-未审核",?,?,?,?,?,?,?,?,?,?,?)',
        sql_update = 'UPDATE teacher SET bysj=JSON_ARRAY_APPEND(bysj,"$",?) WHERE teacher.id=?;SELECT * FROM bysj WHERE id=?',
        teacher;

    mysql.transaction().then(conn => {
        let param = [account, password];
        return conn.find(sql_query, param);
    }).then(({ results, conn }) => {
        if (!results.length) {
            return Promise.reject(10);
        }
        if (superApp.maxProjectsMap[results[0].proTitle] <= results[0].bysjNum) {
            return Promise.reject(11);
        }
        teacher = results[0].id;

        let param = [title, group, introduction, materials, type, source, requirement, difficulty, weight, JSON.stringify({ allRound, experiment, graphic, data, analysis }), teacher];
        return conn.find(sql_insert, param);
    }).then(({ results, conn }) => {
        let param = [results.insertId, teacher, results.insertId];
        return conn.find(sql_update, param);
    }).then(({ results, conn }) => {
        return conn.commitPromise(results[1][0]);
    }).then(result => {
        if (req.file) {
            let from = req.file.path,
                to = FILES + '/' + result.group + '/subject' + result.id + '/teacher/' + req.file.filename;
            file.move(from, to, (err) => {
                if (err) throw err;
                res.send('课题发布成功！');
            });
        } else {
            res.render('subject-card', result);
        }
    }).catch(util.catchError(res, errorMap));
};

function modify(req, res) {
    let { id, title, introduction, type, source, requirement, difficulty, weight, password } = req.body,
        { allRound, experiment, graphic, data, analysis } = req.body,
        account = req.session.account;
    introduction = introduction.replace(/\r/g, '');
    requirement = requirement.replace(/\r/g, '');
    let sql_query = 'SELECT 1 FROM teacher WHERE account=? AND password=?',
        sql_update = 'UPDATE bysj SET ?,lastModifiedTime=CURDATE(),state="1-未审核" WHERE id=?;SELECT * FROM bysj WHERE id=?';
    mysql.find(sql_query, [account, password]).then(results => {
        let param = { title, introduction, type, source, requirement, difficulty, weight, ability: JSON.stringify({ allRound, experiment, graphic, data, analysis }) };
        if (results.length) {
            if (req.file) {
                param.materials = req.file.filename;
            }
            return mysql.find(sql_update, [param, id, id]);
        } else {
            return Promise.reject(10);
        }
    }).then(results => {
        if (req.file) {
            let from = req.file.path,
                toDir = FILES + '/' + results[1][0].group + '/subject' + results[1][0].id + '/teacher/',
                to = toDir + req.file.originalname;
            file.deleteAll(toDir);
            file.move(from, to, (err) => {
                if (err) throw err;
                res.send('修改课题成功！');
            });
        } else {
            res.render('subject-card', results[1][0]);
        }
    }).catch(util.catchError(res, errorMap));
}

function notice(req, res) {
    let { id, title, content } = req.body,
        sql_update = 'UPDATE bysj SET notice=JSON_ARRAY_INSERT(notice,"$[0]",JSON_OBJECT("date",CURDATE(),"title",?,"content",?)) WHERE id=?';
    mysql.find(sql_update, [title, content, id]).then(() => {
        res.send('通知发布成功！');
    }).catch(util.catchError(res));
}

function mark(req, res) {
    let { id, mark, password } = req.body,
        { userId } = req.session,
        sql_query = 'SELECT 1 FROM teacher WHERE id=? AND password=?',
        sql_update = 'UPDATE student SET score_bysj =? WHERE id=?';
    mysql.find(sql_query, [userId, password]).then(result => {
        if (result.length) {
            return mysql.find(sql_update, [mark, id]);
        } else {
            return Promise.reject(10);
        }
    }).then(() => {
        res.send('评分成功！');
    }).catch(util.catchError(res, errorMap));
}

function choose(req, res) {
    let { userId, group } = req.session,
        { id, password, target } = req.body,
        ifFinal = req.fsm.now().name == 'final';
    /* , ifGaoGong = group == superApp.groupMap[6] */
    let sql_query = 'SELECT bysj FROM student WHERE id=? AND password=?;SELECT 1 FROM bysj WHERE state="0-通过" AND student IS NULL AND id=?',
        /*  + (ifGaoGong ? ';SELECT COUNT(*) total,(SELECT `limit` FROM goal g WHERE g.`group`=(SELECT `group` FROM bysj WHERE id=?)) `limit` FROM student s,bysj b WHERE s.`group`="' + superApp.groupMap[6] + '" AND (s.bysj=b.id OR s.target1=b.id) AND b.`group`=(SELECT `group` FROM bysj WHERE id=?)' : '') */
        sql_update_choose = `UPDATE student SET target${target}=? WHERE id=?`,
        sql_update_final = 'UPDATE student SET target1=NULL,target2=NULL,target3=NULL,bysj=? WHERE id=?;UPDATE bysj SET student=? WHERE id=?';
    let param = [userId, password, id];
    /* ifGaoGong && param.push(id); */
    mysql.find(sql_query, param).then(results => {
        if (results[0].length == 0) {
            return Promise.reject(10);
        }
        if (results[1].length == 0) {
            return Promise.reject(13);
        }
        if (results[0][0].bysj) {
            return Promise.reject(18);
        }
        /* if (ifGaoGong && results[2][0].total >= (results[2][0].limit || 1000) && (ifFinal || target == 1)) {
            return Promise.reject(17);
        } */
        return mysql.transaction().then(conn => {
            return conn.find(ifFinal ? sql_update_final : sql_update_choose, ifFinal ? [id, userId, userId, id] : [id, userId]);
        }).then(({ results, conn }) => {
            return conn.commitPromise(results);
        });
    }).then(() => {
        res.send('选择课题成功！');
    }).catch(util.catchError(res, errorMap));
}

function check(req, res) {
    const ifPassObj = {
        yes: '0-通过',
        no: '2-未通过'
    };
    let { id } = req.body,
        sql_update = 'UPDATE bysj SET state=?,`check`=? WHERE id=?';
    if (req.body.extra) {
        req.body.extra = req.body.extra.replace(/\r/g, '');
    }
    delete req.body.id;
    mysql.find(sql_update, [ifPassObj[req.body.ifPass], JSON.stringify(req.body), id]).then(() => {
        res.send('审查意见提交成功！');
    }).catch(util.catchError(res));
}

function confirm(req, res, next) {
    let { id, confirm, password } = req.body,
        { userId } = req.session,
        sql_query = 'SELECT 1 FROM teacher WHERE id=? AND password=?;SELECT 1 FROM student WHERE id=? AND bysj IS NULL;SELECT email FROM student WHERE target1=? OR target2=? OR target3=?;',
        sql_update1 = 'UPDATE bysj SET student=? WHERE id=?',
        sql_update2 = 'UPDATE student SET bysj=?,target1=NULL,target2=NULL,target3=NULL WHERE id=?',
        sql_update3 = 'UPDATE student SET target1=NULL WHERE target1=?;UPDATE student SET target2=NULL WHERE target2=?;UPDATE student SET target3=NULL WHERE target3=?';
    mysql.find(sql_query, [userId, password, confirm, id, id, id]).then(results => {
        if (!results[0].length) {
            return Promise.reject(10);
        }
        if (!results[1].length) {
            return Promise.reject(19);
        }
        return mysql.transaction().then(conn => {
            return conn.find(sql_update1, [confirm, id]);
        }).then(({ conn }) => {
            return conn.find(sql_update2, [id, confirm]);
        }).then(({ conn }) => {
            return conn.find(sql_update3, [id, id, id]);
        }).then(({ conn }) => {
            return conn.commitPromise();
        }).then(() => {
            let to = [];
            for (let i = 0; i < results[2].length; i++) {
                results[2][i].email && to.push(results[2][i].email);
            }
            req.body.to = to;
            req.body.subject = '课题状况变动';
            req.body.html = `<p>您选择的某个课题状态发生变化，请及时登陆系统查看。如未被老师选中，请及时选择其他课题。</p>`;
            next();
        })
    }).catch(util.catchError(res, errorMap));
}

function del(req, res) {
    let { id } = req.query,
        { account } = req.session,
        sql_query = 'SELECT bysj FROM teacher WHERE account=?',
        sql_del = 'DELETE FROM bysj WHERE id=?',
        sql_update = 'UPDATE teacher SET bysj=? WHERE account=?';

    mysql.find(sql_query, account).then(results => {
        return mysql.transaction().then(conn => {
            return conn.find(sql_del, id);
        }).then(({ conn }) => {
            let bysj = results[0].bysj,
                index = bysj.indexOf(Number(id));
            bysj.splice(index, 1);
            return conn.find(sql_update, [JSON.stringify(bysj), account]);
        }).then(({ conn }) => {
            return conn.commitPromise();
        }).then(() => {
            res.send('课题已成功删除！');
        })
    }).catch(util.catchError(res));
}

module.exports = { query, submit, modify, notice, mark, choose, check, confirm, del };