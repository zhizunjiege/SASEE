const mysql = require('./sql'),
    file = require('./file');

function submit(req, res) {
    const group_desArray = ['自动控制与模式识别', '自主导航与精确制导', '检测与自动化工程', '飞行器控制与仿真', '机电控制与液压'];
    let { title, group, capacity, introduction, password } = req.body,
        group_des = group_desArray[group - 1],
        materials = req.file.filename,
        account = req.session.account,
        paramArray = [title, group, group_des, capacity, introduction, materials];
    let sql_query = 'SELECT id,password FROM teacher WHERE account=?',
        sql_insert = 'INSERT INTO bysj (title,`group`,group_des,capacity,introduction,materials,submitTime,lastModifiedTime,teacher,state,studentFiles,teacherFiles,notice,student_selected,student_final) VALUES (?,?,?,?,?,?,CURDATE(),CURDATE(),?,0,JSON_ARRAY(),JSON_ARRAY(),JSON_ARRAY(),JSON_ARRAY(),JSON_ARRAY())',
        sql_update = 'UPDATE teacher SET bysj=JSON_ARRAY_APPEND(bysj,"$",?) WHERE teacher.id=?;SELECT * FROM bysj WHERE id=?',
        teacher_id;

    mysql.transaction().then(conn => {
        return conn.find(sql_query, account);
    }).then(({ results, conn }) => {
        if (password != results[0].password) {
            return Promise.reject('密码错误，请稍后重试！');
        }
        teacher_id = results[0].id;
        paramArray.push(teacher_id);
        return conn.find(sql_insert, paramArray);
    }).then(({ results, conn }) => {
        return conn.find(sql_update, [results.insertId, teacher_id, results.insertId]);
    }).then(({ results, conn }) => {
        return conn.commitPromise(results);
    }).then(results => {
        let from = req.file.path,
            to = req.APP_CONSTANT.PATH_FILES + 'group' + results[1][0].group + '/subject' + results[1][0].id + '/teacher/' + req.file.filename;
        file.move(from, to, (err) => {
            if (err) throw err;
            res.render('subject-card', results[1][0]);
        });
    }).catch(err => {
        if (err instanceof Error) {
            res.status(403).send('服务器错误，请稍后重试！');
            throw err;
        } else {
            res.status(403).send(err);
        }
    });
};

function modify(req, res) {
    let { id, title, group, capacity, introduction, password } = req.body,
        materials = req.file ? req.file.filename : '',
        account = req.session.account,
        paramObj = { title, capacity, introduction, materials };
    let sql_query = 'SELECT 1 FROM teacher WHERE account=? AND password=?',
        sql_update = 'UPDATE bysj SET ?,lastModifiedTime=CURDATE() WHERE id=?;SELECT * FROM bysj WHERE id=?';
    mysql.find(sql_query, [account, password]).then(results => {
        if (results.length != 0) {
            if (!req.file) {
                delete paramObj.materials;
            }
            return mysql.find(sql_update, [paramObj, id, id]);
        } else {
            return Promise.reject('密码验证错误，请重试！');
        }
    }).then(results => {
        if (req.file) {
            let from = req.file.path,
                toDir = req.APP_CONSTANT.PATH_FILES + 'group' + group + '/subject' + id + '/teacher/',
                to = toDir + req.file.originalname;
            file.deleteAll(toDir);
            file.move(from, to, (err) => {
                if (err) throw err;
                res.render('subject-card', results[1][0]);
            });
        } else {
            res.render('subject-card', results[1][0]);
        }
    }).catch(err => {
        if (err instanceof Error) {
            res.status(403).send('服务器错误，请稍后重试！');
            throw err;
        } else {
            res.status(403).send(err);
        }
    });
}

function notice(req, res) {
    let { id, title, content } = req.body,
        sql_update = 'UPDATE bysj SET notice=JSON_ARRAY_INSERT(notice,"$[0]",JSON_OBJECT("date",CURDATE(),"title",?,"content",?)) WHERE id=?';
    mysql.find(sql_update, [title, content, id]).then(() => {
        res.send('通知发布成功！');
    }).catch(err => {
        res.status(403).send('通知发布失败，请稍后重试！');
    });
}

function mark(req, res) {
    let { id } = req.body;
    delete req.body.id;
    let entries = Object.entries(req.body),
        paramArray = entries.reduce((ac, cur) => ac.concat(cur)),
        sql_update = 'UPDATE student s SET score_bysj = CASE s.id' + ' WHEN ? THEN ?'.repeat(entries.length) + ' END WHERE JSON_CONTAINS((SELECT student_selected FROM bysj b WHERE b.id=?),CONCAT("",s.id))';
    paramArray.push(id);
    mysql.find(sql_update, paramArray).then(() => {
        res.send('评分成功！');
    }).catch(err=>{
        console.log(err);
        res.status(403).send('评分失败，请重试！');
    });
}

module.exports = { submit, modify, notice, mark };