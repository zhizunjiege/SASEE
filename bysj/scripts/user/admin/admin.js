const express = require('express'),
    [mysql, file, email, general, views, util, upload, excelImport] = superApp.requireUserModules([
        'mysql',
        'file',
        'email',
        'general',
        'views',
        'util',
        'upload',
        'excelImport'
    ]),
    { VIEWS_ADMIN, VIEWS_COMMON, NEWS, LICENSE, MANUAL, FILES } = superApp.resourses,
    groupMap = superApp.groupMap;

const admin = express(),
    adminViews = express.Router();

admin.set('views', VIEWS_ADMIN);
admin.get('/', (req, res, next) => {
    req.renderData = {
        file: 'login'
    };
    next();
}, views.render);
admin.get('/sendPinCode', (req, res, next) => {
    req.query.identity = 'admin';
    next();
}, email._spcmw, email.sendPinCode);
admin.post('/login', (req, res) => {
    let { account, password } = req.body,
        { pinCode } = req.session,
        sql_query = 'SELECT account,password,email FROM admin WHERE account = ? AND password=?';
    mysql.find(sql_query, [account, password])
        .then(data => {
            if (data.length == 0) {
                res.status(403).send('账号或密码错误，请重试！');
            } /* else if (!pinCode || Date.now() - pinCode.time > 5 * 60 * 1000) {
                req.session.pinCode = null;
                res.status(403).send('验证码已失效，请重试！');
            } else if (req.body.pinCode != pinCode.code) {
                res.status(403).send('验证码错误，请重试！');
            }  */else {
                req.session.email = data[0].email;
                req.session.account = data[0].account;
                req.session.password = data[0].password;
                req.session.identity = 'admin';
                req.session.tmp = {};
                res.location('/admin/main').send('登陆成功！');
            }
        });
    /* let { account, password } = req.body;
    req.session.account = account;
    req.session.password = password;
    req.session.identity = 'admin';
    req.session.tmp = {};
    res.location('/admin/main').send('登陆成功！'); */
});
admin.use(general.auth({ url: '/admin', identity: 'admin' }));
admin.get('/logout', general.logout('/admin'));

admin.get('/main', (req, res, next) => {
    req.renderData = {
        file: 'main'
    };
    next();
}, views.render);

adminViews.get('/submitNotice', (req, res, next) => {
    req.renderData = {
        file: 'submitNotice',
        extraData: groupMap
    };
    next();
}, views.render);
adminViews.get('/sendEmail', (req, res, next) => {
    req.renderData = {
        file: 'sendEmail',
        extraData: groupMap
    };
    next();
}, views.render);
adminViews.get('/updateState', (req, res, next) => {
    req.renderData = {
        file: 'updateState',
        extraData: {
            initialized: req.fsm.initialized,
            now: req.fsm.now(),
            states: req.fsm.info()
        }
    };
    next();
}, views.render);
adminViews.get('/setLimit', (req, res, next) => {
    req.renderData = {
        sql_query: 'SELECT `group`,goal,`limit` FROM goal ORDER BY `group`;SELECT `group`,COUNT(*) total FROM student GROUP BY `group` ORDER BY `group`;SELECT `group`,COUNT(*) total FROM teacher GROUP BY `group` ORDER BY `group`;SELECT `group`,state,COUNT(*) total FROM bysj GROUP BY `group`,state ORDER BY `group`,state',
        file: 'setLimit',
        extraData: groupMap
    };
    next();
}, views.render);
adminViews.get('/writeLicense', (req, res, next) => {
    req.renderData = {
        file: 'writeLicense'
    };
    next();
}, views.render);
adminViews.get('/writeManual', (req, res, next) => {
    req.renderData = {
        file: 'writeManual'
    };
    next();
}, views.render);
adminViews.get('/importInfo', (req, res, next) => {
    req.renderData = {
        file: 'importInfo'
    };
    next();
}, views.render);
adminViews.get('/exportInfo', (req, res, next) => {
    req.renderData = {
        file: 'exportInfo'
    };
    next();
}, views.render);
adminViews.get('/editInfo', (req, res, next) => {
    req.renderData = {
        file: 'editInfo'
    };
    next();
}, views.render);

admin.use('/views', views.common, adminViews);

admin.post('/submitNotice', (req, res) => {
    let { top, title, group, content } = req.body,
        sql_insert = 'INSERT INTO news (top,title,date,`group`) VALUES (?,?,CURDATE(),?)';
    mysql.find(sql_insert, [top == 'on' ? 1 : 0, title, JSON.stringify(group)]).then(info => {
        file.writeFile(NEWS + '/' + info.insertId + '.ejs', content, err => {
            if (err) throw err;
            res.send('通知发布成功！');
        });
    }).catch(util.catchError(res));
});
admin.post('/sendEmail', (req, res, next) => {
    let { identity } = req.body,
        sql_query = 'SELECT email FROM dean WHERE `group`=?';
    mysql.find(sql_query, identity).then(results => {
        req.body.toAddr = results.map(x => x.email);
        next();
    });
}, email.sendEmail);

admin.post('/setLimit', (req, res) => {
    let sql_update = 'UPDATE goal SET goal=?,`limit`=? WHERE `group`=?;', param = [];
    for (let i = 0; i < groupMap.length - 1; i++) {
        param.push(req.body.goal[i], req.body.limit[i], groupMap[i]);
    }
    mysql.find(sql_update.repeat(groupMap.length - 1), param).then(() => {
        res.send('设置成功！');
    }).catch(util.catchError(res));
});
admin.post('/writeLicense', (req, res) => {
    let { identity, content } = req.body;
    file.writeFile(LICENSE + '/license.ejs', content, err => {
        if (err) {
            console.log(err);
            res.status(403).send('协议发布失败，请稍后重试！');
        }
        res.send('协议发布成功！');
    });
});
admin.post('/writeManual', (req, res) => {
    let { identity, content } = req.body;
    file.writeFile(MANUAL + '/' + identity + '.ejs', content, err => {
        if (err) {
            console.log(err);
            res.status(403).send('用户手册发布失败，请稍后重试！');
        }
        res.send('用户手册发布成功！');
    });
});

admin.post('/importStudent', upload.receiver.single('student'), excelImport.importStudent);
admin.post('/importTeacher', upload.receiver.single('teacher'), excelImport.importTeacher);

const editUserInfoSql = {
    student: 'SELECT account,email,name,gender,specialty,`group`,class,postgraduate FROM student WHERE account=?',
    teacher: 'SELECT account,email,name,gender,`group`,proTitle,department FROM teacher WHERE account=?',
    dean: 'SELECT account,email,name,gender,`group` FROM dean WHERE account=?',
    admin: 'SELECT account,email FROM admin WHERE account=?'
};
admin.post('/searchUserInfo', (req, res) => {
    let { identity, account } = req.body;
    mysql.find(editUserInfoSql[identity], account)
        .then(result => {
            if (result.length) {
                req.session.tmp.account = account;
                result[0].identity = identity;
                res.json(result[0]);
            } else {
                res.end();
            }
        }).catch(util.catchError(res));
});
admin.post('/editUserInfo', (req, res) => {
    let { identity, account } = req.body,
        oldAccount = req.session.tmp.account;
    sql_update = 'UPDATE ?? SET ? WHERE account=?';
    for (const [key, value] of Object.entries(req.body)) {
        if (!value) {
            delete req.body[key];
        }
    }
    if (identity == 'student') {
        req.body.stuNum = account;
    }
    if (identity == 'teacher') {
        req.body.teaNum = account;
    }
    delete req.body.identity;
    mysql.find(sql_update, [identity, req.body, oldAccount || account])
        .then(() => {
            res.send('修改信息成功！');
        }).catch(err => {
            console.log(err);
            res.status(403).send('修改失败，请仔细检查数据格式是否符合要求。');
        });
});

admin.post('/searchSubjectInfo', (req, res) => {
    let { id, account } = req.body,
        sql_query = `SELECT ${id ? 'b.*' : 'b.id,b.title'} FROM bysj b,teacher t WHERE t.account=? AND ${id ? `b.id=${id}` : `b.teacher=t.id`}`;
    mysql.find(sql_query, account)
        .then(results => {
            if (results.length) {
                if (id) {
                    req.session.tmp.teaNum = account;
                    res.render(VIEWS_COMMON + '/subject-form', {
                        data: results[0],
                        extraData: {
                            formId: 'edit_subject_form',
                            ifNeedPass: false
                        }
                    });
                } else {
                    res.json(results);
                }
            } else {
                res.end();
            }
        }).catch(util.catchError(res));
});
admin.post('/editSubjectInfo', upload.receive, (req, res) => {
    let { id, title, introduction, type, source, requirement, difficulty, weight } = req.body,
        { allRound, experiment, graphic, data, analysis } = req.body;
    let sql_update = 'UPDATE bysj SET ?,lastModifiedTime=CURDATE() WHERE id=?;SELECT id,`group` FROM bysj WHERE id=? ',
        param = { title, introduction, type, source, requirement, difficulty, weight, ability: JSON.stringify({ allRound, experiment, graphic, data, analysis }) };
    if (req.file) {
        param.materials = req.file.filename;
    }
    mysql.find(sql_update, [param, id, id])
        .then(results => {
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
                res.send('修改课题成功！');
            }
        }).catch(util.catchError(res));
});

admin.get('/deleteSubject', (req, res) => {
    let { id } = req.query,
        account = req.session.tmp.teaNum,
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
});

admin.post('/initState', (req, res) => {
    if (req.fsm.initialized) {
        res.status(403).send('系统已经初始化！');
        return;
    }
    let states = req.fsm.info();
    for (const iterator of states) {
        if (req.body[iterator.name]) {
            iterator.start = new Date(req.body[iterator.name]).toLocaleISOString();
        }
    }
    states.shift();
    req.fsm.initialize(states).then(info => {
        res.send('初始化成功！');
    }).catch(util.catchError(res));
});
admin.post('/updateState', (req, res) => {
    if (!req.fsm.initialized) {
        res.status(403).send('系统尚未初始化！');
        return;
    }
    let { name, start } = req.body;
    start = new Date(start).toLocaleISOString();
    req.fsm.update(name, start).then(() => {
        res.send('时间设置更新成功！');
    }).catch(util.catchError(res));
});
admin.get('/nextState', (req, res) => {
    if (!req.fsm.initialized) {
        res.status(403).send('系统尚未初始化！');
        return;
    }
    if (req.fsm.completed) {
        res.status(403).send('系统已经运行完成！');
        return;
    }
    req.fsm.next().then(() => {
        res.send('立即启动成功！');
    }).catch(util.catchError(res));
});

admin.post('/editorImg', upload.receive, general.editorImg);
admin.get('/editorImg', general.editorImg);

module.exports = admin;