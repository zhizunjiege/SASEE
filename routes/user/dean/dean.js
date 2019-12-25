const express = require('express'),
    [login, email, general, views, subject, password, info, download] = superApp.requireUserModules([
        'login',
        'email',
        'general',
        'views',
        'subject',
        'password',
        'info',
        'download'
    ]),
    { VIEWS_DEAN, VIEWS_STUDENT } = superApp.resourses;

const dean = express(), emailRouter = express.Router(), fileRouter = express.Router();

dean.set('views', VIEWS_DEAN);
dean.use(general.auth({ url: '/', identity: 'dean' }));
dean.get('/', login.render);

dean.get('/license/agree', general.agreeLicense);
dean.get('/license/disagree', general.disagreeLicense);

dean.get('/logout', general.logout());
dean.post('/password', password.modify);

const deanViews = express.Router();
deanViews.get('/userInfo', (req, res, next) => {
    req.renderData = {
        sql_query: 'SELECT * FROM dean WHERE id =?',
        param: req.session.userId,
        file: 'userInfo'
    };
    next();
}, views.render);
deanViews.get('/statistics', general.permiss([]), (req, res, next) => {
    let { group } = req.session;
    req.renderData = {
        sql_query: 'SELECT name,gender,teaNum,proTitle,JSON_LENGTH(bysj) submitted,email FROM teacher WHERE `group`=? ORDER BY teaNum;SELECT COUNT(*) totalStu FROM student WHERE `group`=?;SELECT goal FROM goal WHERE `group`=?;SELECT state,COUNT(*) count FROM bysj WHERE `group`=? GROUP BY state;',
        param: [group, group, group, group],
        file: 'statistics',
        extraData: superApp.maxProjectsMap
    };
    next();
}, views.render);
deanViews.get('/subject', general.permiss(['submit', 'review', 'modify', 'release']), (req, res, next) => {
    req.renderData = {
        sql_query: 'SELECT (SELECT COUNT(*) FROM bysj WHERE `group`=?) total,b.id,title,submitTime,lastModifiedTime,state,`check`,(SELECT name FROM teacher t WHERE t.id=b.teacher) teaName,(SELECT proTitle FROM teacher t WHERE t.id=b.teacher) proTitle FROM bysj b WHERE `group`=? ORDER BY submitTime,b.id LIMIT 10 OFFSET 0',
        param: [req.session.group, req.session.group],
        file: 'subject'
    };
    next();
}, views.render);
deanViews.get('/subjectList', general.permiss(['submit', 'review', 'modify', 'release']), (req, res, next) => {
    req.renderData = {
        sql_query: 'SELECT b.id,title,submitTime,lastModifiedTime,state,`check`,(SELECT name FROM teacher t WHERE t.id=b.teacher) teaName,(SELECT proTitle FROM teacher t WHERE t.id=b.teacher) proTitle FROM bysj b WHERE `group`=? ORDER BY submitTime,b.id LIMIT 10 OFFSET ?',
        param: [req.session.group, ((Number(req.query.page) || 1) - 1) * 10],
        file: 'subjectList'
    };
    next();
}, views.render);
deanViews.get('/subjectContent', general.permiss(['submit', 'review', 'modify', 'release']), (req, res, next) => {
    req.renderData = {
        sql_query: 'SELECT * FROM bysj WHERE id=?;SELECT t.* FROM teacher t,bysj b WHERE b.teacher=t.id AND b.id=?',
        param: [req.query.id, req.query.id],
        file: 'subjectContent'
    };
    next();
}, views.render);

dean.use('/views', views.common, deanViews);


fileRouter.get('/download', download.download);
dean.use('/file', general.permiss(['submit', 'review', 'modify', 'release', 'general']), fileRouter);

emailRouter.get('/sendPinCode', general.permiss([]), email.sendPinCode);
emailRouter.post('/setEmailAddr', general.permiss([]), info.setEmailAddr);
dean.use('/email', emailRouter);

dean.post('/check', general.permiss(['submit', 'review', 'modify', 'release']), subject.check);

dean.get('/editorImg', general.editorImg);

module.exports = dean;