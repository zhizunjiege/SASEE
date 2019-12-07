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
        sql_query: 'SELECT * FROM teacher WHERE id =?',
        param: req.session.userId,
        file: 'userInfo'
    };
    next();
}, views.render);
teacherViews.get('/subject', general.permiss(['submit', 'review', 'modify', 'release', 'choose', 'draw', 'publicity', 'final', 'general']), (req, res, next) => {
    req.renderData = {
        sql_query: 'SELECT b.id,title,introduction,difficulty,weight,submitTime,lastModifiedTime,state FROM bysj b,teacher t WHERE t.id=? AND JSON_CONTAINS(t.bysj,CONCAT("",b.id))',
        param: req.session.userId,
        file: 'subject',
        extraData: {
            maxProjects: superApp.maxProjectsMap[req.session.proTitle] || 0,
            ifPermiss: req.fsm.now().name == 'submit'
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
        sql_query: 'SELECT id,title,introduction,type,source,requirement,difficulty,weight,ability,materials FROM bysj WHERE id=?',
        param: req.query.id,
        file: 'submitSubject'
    };
    next();
}, views.render);
teacherViews.get('/mySubject', general.permiss(['choose', 'publicity', 'final', 'general']), (req, res, next) => {
    let { id } = req.query, period = req.fsm.now().name;
    if (period == 'choose' || period == 'publicity' || period == 'final') {
        req.renderData = {
            sql_query: 'SELECT * FROM student WHERE bysj=?;SELECT * FROM student WHERE target1=?;SELECT * FROM student WHERE target2=?;SELECT * FROM student WHERE target3=?',
            param: [id, id, id, id],
            file: 'subjectConfirm',
            extraData: {
                id,
                ifChoose: period == 'choose'
            }
        }
    } else {
        req.renderData = {
            sql_query: 'SELECT * FROM bysj WHERE id=?;SELECT s.* FROM student s,bysj b WHERE b.id=? AND s.bysj=b.id',
            param: [id, id],
            file: 'mySubject'
        };
    }
    next();
}, views.render);

teacher.use('/views', views.common, teacherViews);

fileRouter.post('/upload', upload.receive, upload.upload);
fileRouter.get('/download', download.download);
teacher.use('/file', general.permiss(['general']), fileRouter);

subjectRouter.get('/query', general.permiss(['submit']), subject.query);
subjectRouter.post('/submit', general.permiss(['submit']), upload.receive, subject.submit);
subjectRouter.post('/modify', general.permiss(['submit', 'modify']), upload.receive, subject.modify);
subjectRouter.post('/confirm', general.permiss(['choose']), subject.confirm);
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