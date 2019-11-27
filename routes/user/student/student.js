const express = require('express'),
    [general, login, views, upload, download, info, email, password, subject] = superApp.requireUserModules([
        'general',
        'login',
        'views',
        'upload',
        'download',
        'info',
        'email',
        'password',
        'subject'
    ]),
    { VIEWS_STUDENT } = superApp.resourses;

const student = express(),
    emailRouter = express.Router(),
    fileRouter = express.Router(),
    studentViews = express.Router();

student.set('views', VIEWS_STUDENT);
student.use(general.auth({ url: '/', identity: 'student' }));
student.get('/', login.render);

student.get('/license/agree',general.agreeLicense);
student.get('/license/disagree',general.disagreeLicense);

student.get('/logout', general.logout());
student.post('/password', password.modify);

studentViews.get('/userInfo', (req, res, next) => {
    req.renderData = {
        sql_query: 'SELECT * FROM student WHERE account =?',
        param: req.session.account,
        file: 'userInfo'
    };
    next();
}, views.render);
studentViews.get('/subject', general.permiss(['choose', 'final']), (req, res, next) => {
    req.renderData = req.session.specialty == 0 ? {
        sql_query: 'SELECT (SELECT COUNT(*) FROM bysj WHERE bysj.state=1) total,b.id,`group`,title,chosen,capacity,submitTime,(SELECT name FROM teacher t WHERE t.id=b.teacher) teacher FROM bysj b WHERE b.state=1 ORDER BY submitTime,b.id LIMIT 10 OFFSET 0',
        file: 'subject'
    } : {
            sql_query: 'SELECT (SELECT COUNT(*) FROM bysj WHERE bysj.state=1 AND `group`=?) total,b.id,`group`,title,chosen,capacity,submitTime,(SELECT name FROM teacher t WHERE t.id=b.teacher) teacher FROM bysj b WHERE b.state=1 AND `group`=? ORDER BY submitTime,b.id LIMIT 10 OFFSET 0',
            param: [req.session.group, req.session.group],
            file: 'subject'
        };
    next();
}, views.render);
studentViews.get('/subjectList', general.permiss(['choose', 'final']), (req, res, next) => {
    req.renderData = req.session.specialty == 0 ? {
        sql_query: 'SELECT b.id,`group`,title,chosen,capacity,submitTime,(SELECT name FROM teacher t WHERE t.id=b.teacher) teacher FROM bysj b WHERE b.state=1 ORDER BY submitTime,b.id LIMIT 10 OFFSET ?',
        param: ((Number(req.query.page) || 1) - 1) * 10,
        file: 'subjectList'
    } : {
            sql_query: 'SELECT b.id,`group`,title,chosen,capacity,submitTime,(SELECT name FROM teacher t WHERE t.id=b.teacher) teacher FROM bysj b WHERE b.state=1 AND `group`=? ORDER BY submitTime,b.id LIMIT 10 OFFSET ?',
            param: [req.session.group, ((Number(req.query.page) || 1) - 1) * 10],
            file: 'subjectList'
        };
    next();
}, views.render);
studentViews.get('/subjectContent', general.permiss(['choose', 'final']), (req, res, next) => {
    req.renderData = {
        sql_query: 'SELECT * FROM bysj WHERE id=?;SELECT t.* FROM teacher t,bysj b WHERE b.teacher=t.id AND b.id=?',
        param: [req.query.id, req.query.id],
        file: 'subjectContent'
    };
    next();
}, views.render);
studentViews.get('/mySubject', general.permiss(['publicity', 'general']), (req, res) => {
    if (req.fsm.now().name == 'publicity') {
        req.renderData = {
            sql_query: 'SELECT id FROM student WHERE account=? AND bysj IS NOT NULL',
            param: req.session.account,
            file: 'mySubjectPublic'
        };
    } else {
        req.renderData = {
            sql_query: 'SELECT s.name stuName,b.id,notice,teacherFiles,studentFiles FROM bysj b,student s WHERE b.id=s.bysj AND s.account=?;SELECT t.* FROM teacher t,bysj b,student s WHERE s.account=? AND s.bysj=b.id AND b.teacher=t.id',
            param: [req.session.account, req.session.account],
            file: 'mySubject'
        };
    }
}, views.render);

student.use('/views', views.common, studentViews);

fileRouter.post('/upload', upload.receive, upload.upload);
fileRouter.get('/download', download.download);
student.use('/file', general.permiss(['general']), fileRouter);

emailRouter.get('/sendPinCode', general.permiss(['open']), email.sendPinCode);
emailRouter.post('/setEmailAddr', general.permiss(['open']), info.setEmailAddr);
emailRouter.post('/sendEmail', general.permiss(['general']), email.sendEmail);
student.use('/email', emailRouter);

student.post('/choose', general.permiss(['choose', 'final']), (req, res, next) => {
    if (req.fsm.now().name == 'choose') {
        req.body.colume = 'selected';
    } else {
        req.body.colume = 'final';
    }
    next();
}, subject.choose);

module.exports = student;