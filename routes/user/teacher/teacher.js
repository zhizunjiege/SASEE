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
    { VIEWS_TEACHER } = superApp.resourses;

const teacher = express(),
    fileRouter = express.Router(),
    subjectRouter = express.Router(),
    emailRouter = express.Router(),
    teacherViews = express.Router();

teacher.set('views', VIEWS_TEACHER);
teacher.use(general.auth({ url: '/', identity: 'teacher' }));
teacher.get('/', login.render);

teacher.get('/license/agree', general.agreeLicense);
teacher.get('/license/disagree', general.disagreeLicense);

teacherViews.get('/userInfo', (req, res, next) => {
    req.renderData = {
        sql_query: 'SELECT * FROM teacher WHERE account =?',
        param: req.session.account,
        file: 'userInfo'
    };
    next();
}, views.render);
teacherViews.get('/subject', general.permiss(['submit', 'review', 'modify', 'release', 'choose', 'draw', 'publicity', 'final', 'general']), (req, res, next) => {
    req.renderData = {
        sql_query: 'SELECT b.id,title,chosen,capacity,introduction,submitTime,lastModifiedTime,state FROM bysj b,teacher t WHERE account=? AND JSON_CONTAINS(t.bysj,CONCAT("",b.id))',
        param: req.session.account,
        file: 'subject',
        extraData: {
            maxProjects: superApp.maxProjectsMap[req.session.proTitle],
            ifPermiss:req.fsm.now().name=='submit'
        }
    };
    next();
}, views.render);
teacherViews.get('/submitSubject', general.permiss(['submit']), (req, res, next) => {
    req.renderData = {
        file: 'submitSubject'
    };
    next();
}, views.render);
teacherViews.get('/modifySubject', general.permiss(['submit', 'modify']), (req, res, next) => {
    req.renderData = {
        sql_query: 'SELECT id,title,`group`,capacity,introduction,materials FROM bysj WHERE id=?',
        param: req.query.id,
        file: 'submitSubject'
    };
    next();
}, views.render);
teacherViews.get('/mySubject', general.permiss(['choose', 'final', 'general']), (req, res, next) => {
    req.renderData = {
        sql_query: 'SELECT id,notice,teacherFiles,studentFiles FROM bysj WHERE id=?;SELECT s.* FROM student s,bysj b WHERE b.id=? AND JSON_CONTAINS(b.student_final,JSON_QUOTE(CONCAT("",s.id)))',
        param: [req.query.id, req.query.id],
        file: 'mySubject'
    };
    next();
}, views.render);

teacher.use('/views', views.common, teacherViews);

fileRouter.post('/upload', upload.receive, upload.upload);
fileRouter.get('/download', download.download);
teacher.use('/file', general.permiss(['general']), fileRouter);

subjectRouter.post('/submit', general.permiss(['submit']), upload.receive, subject.submit);
subjectRouter.post('/modify', general.permiss(['submit', 'modify']), upload.receive, subject.modify);
subjectRouter.post('/notice', general.permiss(['general']), subject.notice);
subjectRouter.post('/mark', general.permiss(['general']), subject.mark);
teacher.use('/subject', subjectRouter);

emailRouter.get('/sendPinCode', general.permiss(['info']), email.sendPinCode);
emailRouter.post('/setEmailAddr', general.permiss(['info']), info.setEmailAddr);
emailRouter.post('/sendEmail', general.permiss(['general']), email.sendEmail);
teacher.use('/email', emailRouter);

teacher.post('/info', general.permiss(['info']), info.setGeneralInfo(['field', 'office', 'tele', 'resume']));

teacher.get('/logout', general.logout());
teacher.post('/password', password.modify);

module.exports = teacher;