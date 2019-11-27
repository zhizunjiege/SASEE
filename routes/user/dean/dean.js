const express = require('express'),
    [login, email, general, views, subject, password, info] = superApp.requireUserModules([
        'login',
        'email',
        'general',
        'views',
        'subject',
        'password',
        'info'
    ]),
    { VIEWS_DEAN, VIEWS_STUDENT } = superApp.resourses;

const dean = express(), emailRouter = express.Router();

dean.set('views', VIEWS_DEAN);
dean.use(general.auth({ url: '/', identity: 'dean' }));
dean.get('/', login.render);

dean.get('/license/agree',general.agreeLicense);
dean.get('/license/disagree',general.disagreeLicense);

dean.get('/logout', general.logout());
dean.post('/password', password.modify);

const deanViews = express.Router();
deanViews.get('/userInfo', (req, res, next) => {
    req.renderData = {
        sql_query: 'SELECT * FROM dean WHERE account =?',
        param: req.session.account,
        file: 'userInfo'
    };
    next();
}, views.render);
deanViews.get('/subject', general.permiss(['review', 'release']), (req, res, next) => {
    req.renderData = {
        sql_query: 'SELECT (SELECT COUNT(*) FROM bysj WHERE bysj.state=0 AND `group`=?) total,b.id,`group`,title,chosen,capacity,submitTime,(SELECT name FROM teacher t WHERE t.id=b.teacher) teacher FROM bysj b WHERE b.state=0 AND `group`=? ORDER BY submitTime,b.id LIMIT 10 OFFSET 0',
        param: [req.session.group, req.session.group],
        file: 'subject',
        dir: VIEWS_STUDENT
    };
    next();
}, views.render);
deanViews.get('/subjectList', general.permiss(['review', 'release']), (req, res, next) => {
    req.renderData = {
        sql_query: 'SELECT b.id,`group`,title,chosen,capacity,submitTime,(SELECT name FROM teacher t WHERE t.id=b.teacher) teacher FROM bysj b WHERE b.state=0 AND `group`=? ORDER BY submitTime,b.id LIMIT 10 OFFSET ?',
        param: [req.session.group, ((Number(req.query.page) || 1) - 1) * 10],
        file: 'subjectList',
        dir: VIEWS_STUDENT
    };
    next();
}, views.render);
deanViews.get('/subjectContent', general.permiss(['review', 'release']), (req, res, next) => {
    req.renderData = {
        sql_query: 'SELECT * FROM bysj WHERE id=?;SELECT t.* FROM teacher t,bysj b WHERE b.teacher=t.id AND b.id=?',
        param: [req.query.id, req.query.id],
        file: 'subjectContent'
    };
    next();
}, views.render);

dean.use('/views', views.common, deanViews);

emailRouter.get('/sendPinCode', general.permiss(['open']), email.sendPinCode);
emailRouter.post('/setEmailAddr', general.permiss(['open']), info.setEmailAddr);
dean.use('/email', emailRouter);

dean.post('/pass', general.permiss(['review', 'release']), subject.pass, email.sendEmail);
dean.post('/fail', general.permiss(['review', 'release']), subject.fail, email.sendEmail);

module.exports = dean;