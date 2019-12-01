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
    let sql_query = 'SELECT id,proTitle,JSON_LENGTH(bysj) bysjNum FROM teacher WHERE account=? AND password=?',
        sql_insert = 'INSERT INTO bysj (submitTime,lastModifiedTime,studentFiles,teacherFiles,notice,student_selected,student_final,state,title,`group`,introduction,materials,type, source, requirement, difficulty, weight, ability,teacher) VALUES (CURDATE(),CURDATE(),JSON_ARRAY(),JSON_ARRAY(),JSON_ARRAY(),JSON_ARRAY(),NULL,"未审核",?,?,?,?,?,?,?,?,?,?,?)',
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
                res.render('subject-card', result);
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
    let sql_query = 'SELECT 1 FROM teacher WHERE account=? AND password=?',
        sql_update = 'UPDATE bysj SET ?,lastModifiedTime=CURDATE(),state="未审核" WHERE id=?;SELECT * FROM bysj WHERE id=?';
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
                res.render('subject-card', results[1][0]);
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
    let { id } = req.body;
    delete req.body.id;
    let entries = Object.entries(req.body),
        paramArray = entries.reduce((ac, cur) => ac.concat(cur)),
        sql_update = 'UPDATE student s SET score_bysj = CASE s.id' + ' WHEN ? THEN ?'.repeat(entries.length) + ' END WHERE JSON_CONTAINS((SELECT student_final FROM bysj b WHERE b.id=?),JSON_QUOTE(CONCAT("",s.id)))';
    paramArray.push(id);
    mysql.find(sql_update, paramArray).then(() => {
        res.send('评分成功！');
    }).catch(util.catchError(res));
}

function choose(req, res) {
    let { stuId, account } = req.session,
        { id, password, colume } = req.body;
    let sql_query = 'SELECT bysj FROM student WHERE account=? AND password=?;SELECT capacity,chosen FROM bysj WHERE id=?',
        sql_update1 = 'UPDATE bysj SET chosen=chosen-1,student_' + colume + '=JSON_REMOVE(student_' + colume + ',JSON_UNQUOTE(JSON_SEARCH(student_' + colume + ',"one",?))) WHERE id=?',
        sql_update2 = 'UPDATE bysj SET chosen=chosen+1,student_' + colume + '=JSON_ARRAY_APPEND(student_' + colume + ',"$",CONCAT("",?)) WHERE id=?',
        sql_update3 = 'UPDATE student SET bysj=? WHERE id=?';
    mysql.find(sql_query, [account, password, id]).then(results => {
        if (results[0].length > 0) {
            let { bysj } = results[0][0];
            if (bysj && bysj == id) {
                return Promise.reject(12);
            } else if (colume == 'final' && results[1][0].chosen >= results[1][0].capacity) {
                return Promise.reject(13);
            } else {
                return mysql.transaction().then(conn => {
                    if (bysj) {
                        return conn.find(sql_update1, [stuId, bysj]);
                    } else {
                        return Promise.resolve({
                            results: 'succeeded!',
                            conn: conn
                        });
                    }
                }).then(({ conn }) => {
                    return conn.find(sql_update2, [stuId, id]);
                }).then(({ conn }) => {
                    return conn.find(sql_update3, [id, stuId]);
                }).then(({ results, conn }) => {
                    return conn.commitPromise(results);
                });
            }
        } else {
            return Promise.reject(10);
        }
    }).then(() => {
        res.send('选择课题成功');
    }).catch(util.catchError(res, errorMap));
}

function _changeState(req, res, next, state) {
    let { id } = req.body,
        sql_update = 'UPDATE bysj SET state=? WHERE id=?;SELECT title FROM bysj WHERE id=?';
    mysql.find(sql_update, [state, id, id]).then((results) => {
        req.body.content = '<h3>课题“<strong>' + results[1][0].title + '</strong>”的审核结果：</h3>' + state;
        next();
    }).catch(util.catchError(res));
}

function pass(req, res, next) {
    _changeState(req, res, next, '通过');
}
function fail(req, res, next) {
    _changeState(req, res, next, '不通过');
}

module.exports = { query, submit, modify, notice, mark, choose, pass, fail };