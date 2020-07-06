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
    let name = req.fsm.now().name;
    req.renderData = {
        sql_query: 'SELECT b.id,title,submitTime,lastModifiedTime,state,`check` FROM bysj b,teacher t WHERE t.id=? AND JSON_CONTAINS(t.bysj,CONCAT("",b.id))',
        param: req.session.userId,
        file: 'subject',
        extraData: {
            maxProjects: superApp.maxProjectsMap[req.session.proTitle] || 0,
            ifPermiss: name == 'submit' || name == 'review' || name == 'modify' || name == 'release'
        }
    };
    next();
}, views.render);
teacherViews.get('/submitSubject', general.permiss(['submit', 'review', 'modify', 'release']), (req, res, next) => {
    req.renderData = {
        file: 'submitSubject'
    };
    next();
}, views.render);
teacherViews.get('/modifySubject', general.permiss(['submit', 'review', 'modify', 'release']), (req, res, next) => {
    req.renderData = {
        sql_query: 'SELECT id,title,introduction,type,source,requirement,difficulty,weight,ability,materials FROM bysj WHERE id=?',
        param: req.query.id,
        file: 'submitSubject'
    };
    next();
}, views.render);
teacherViews.get('/mySubject', general.permiss(['choose', 'publicity', 'final', 'general']), (req, res, next) => {
    let { id } = req.query, period = req.fsm.now().name;
    if (period == 'general') {
        req.renderData = {
            sql_query: 'SELECT * FROM bysj WHERE id=?;SELECT s.* FROM student s,bysj b WHERE b.id=? AND s.bysj=b.id',
            param: [id, id],
            file: 'mySubject'
        };
    } else {
        req.renderData = {
            sql_query: 'SELECT * FROM student WHERE bysj=?;SELECT * FROM student WHERE target1=?;SELECT * FROM student WHERE target2=?;SELECT * FROM student WHERE target3=?',
            param: [id, id, id, id],
            file: 'subjectConfirm',
            extraData: {
                id,
                ifChoose: period == 'choose'
            }
        };
    }
    next();
}, views.render);

teacher.use('/views', views.common, teacherViews);

fileRouter.post('/upload', upload.receive, upload.upload);
fileRouter.get('/download', download.download);
teacher.use('/file', general.permiss(['general']), fileRouter);

subjectRouter.get('/query', general.permiss(['submit', 'review', 'modify', 'release']), subject.query);
subjectRouter.post('/submit', general.permiss(['submit', 'review', 'modify', 'release']), upload.receive, subject.submit);
subjectRouter.post('/modify', general.permiss(['submit', 'review', 'modify', 'release']), upload.receive, subject.modify);
subjectRouter.post('/confirm', general.permiss(['choose']), subject.confirm, (req, res) => {
    if (req.body.to.length) {
        email._send({
            to: req.body.to,
            html: req.body.html,
            subject: req.body.subject + email.CONSTANT.SYS_FOOTER
        }).catch(err => {
            if (err instanceof Error) {
                console.log(err);
            }
            return;
        });
    }
    res.send('确认成功！');
});
subjectRouter.get('/delete', general.permiss(['submit', 'review', 'modify', 'release']), subject.del);
subjectRouter.post('/notice', general.permiss(['general']), subject.notice);
subjectRouter.post('/mark', general.permiss(['general']), subject.mark);
teacher.use('/subject', subjectRouter);

emailRouter.get('/sendPinCode', general.permiss([]), email.sendPinCode);
emailRouter.post('/setEmailAddr', general.permiss([]), info.setEmailAddr);
emailRouter.post('/sendEmail', general.permiss(['general']), email.sendEmail);
teacher.use('/email', emailRouter);

teacher.post('/info', general.permiss([]), info.setGeneralInfo(['field', 'office', 'resume']));

teacher.get('/logout', general.logout());
teacher.post('/password', password.modify);

teacher.get('/editorImg', general.editorImg);

module.exports = teacher;