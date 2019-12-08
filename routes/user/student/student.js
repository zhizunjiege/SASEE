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

student.get('/license/agree', general.agreeLicense);
student.get('/license/disagree', general.disagreeLicense);

student.get('/logout', general.logout());
student.post('/password', password.modify);

studentViews.get('/userInfo', (req, res, next) => {
    req.renderData = {
        sql_query: 'SELECT * FROM student WHERE id =?',
        param: req.session.userId,
        file: 'userInfo'
    };
    next();
}, views.render);

let optionalObj = {
    group: ' AND `group`=',
    period: ' AND student IS NULL'
};
let getConditions = req => {
    let { group } = req.session, condition = '';
    if (group !== superApp.groupMap[6]) {
        condition += optionalObj.group + '"' + group + '"';
    }
    condition += optionalObj.period;
    return condition;
};
studentViews.get('/subject', general.permiss(['choose', 'final']), (req, res, next) => {
    let condition = getConditions(req);
    req.renderData = {
        sql_query: `SELECT COUNT(*) total FROM bysj WHERE bysj.state="0-通过"${condition};SELECT b.id,\`group\`,title,(SELECT COUNT(*) FROM student WHERE target1=b.id OR target2=b.id OR target3=b.id) chosen,(SELECT name FROM teacher t WHERE t.id=b.teacher) teacher FROM bysj b WHERE state="0-通过"${condition} ORDER BY id LIMIT 10 OFFSET 0`,
        file: 'subject'
    };
    next();
}, views.render);
studentViews.get('/subjectList', general.permiss(['choose', 'final']), (req, res, next) => {
    let condition = getConditions(req);
    req.renderData = {
        sql_query: `SELECT b.id,\`group\`,title,(SELECT COUNT(*) FROM student WHERE target1=b.id OR target2=b.id OR target3=b.id) chosen,(SELECT name FROM teacher t WHERE t.id=b.teacher) teacher FROM bysj b WHERE state="0-通过"${condition} ORDER BY id LIMIT 10 OFFSET ?`,
        param: ((Number(req.query.page) || 1) - 1) * 10,
        file: 'subjectList'
    };
    next();
}, views.render);
studentViews.get('/subjectContent', general.permiss(['choose', 'final']), (req, res, next) => {
    req.renderData = {
        sql_query: 'SELECT * FROM bysj WHERE id=?;SELECT t.* FROM teacher t,bysj b WHERE b.teacher=t.id AND b.id=?',
        param: [req.query.id, req.query.id],
        file: 'subjectContent',
        extraData: req.fsm.now().name == 'choose'
    };
    next();
}, views.render);
studentViews.get('/mySubject', general.permiss(['choose', 'publicity', 'final', 'general']), (req, res, next) => {
    let { userId } = req.session, period = req.fsm.now().name;
    if (period == 'choose' || period == 'publicity' || period == 'final') {
        req.renderData = {
            sql_query: 'SELECT (SELECT title FROM bysj b WHERE b.id=s.target1) target1,(SELECT title FROM bysj b WHERE b.id=s.target2) target2,(SELECT title FROM bysj b WHERE b.id=s.target3) target3,(SELECT title FROM bysj b WHERE b.id=s.bysj) bysj FROM student s WHERE s.id=?',
            param: userId,
            file: 'mySubjectPublic',
            extraData: period == 'choose'
        };
    } else {
        req.renderData = {
            sql_query: 'SELECT b.*,s.name stuName FROM bysj b,student s WHERE s.id=? AND s.id=b.student;SELECT t.* FROM teacher t,bysj b,student s WHERE s.id=? AND s.bysj=b.id AND b.teacher=t.id',
            param: [userId, userId],
            file: 'mySubject'
        };
    }
    next();
}, views.render);

student.use('/views', views.common, studentViews);

fileRouter.post('/upload', general.permiss(['general']), upload.receive, upload.upload);
fileRouter.get('/download', general.permiss(['choose', 'final', 'general']), download.download);
student.use('/file', fileRouter);

emailRouter.get('/sendPinCode', general.permiss(['info']), email.sendPinCode);
emailRouter.post('/setEmailAddr', general.permiss(['info']), info.setEmailAddr);
emailRouter.post('/sendEmail', general.permiss(['general']), email.sendEmail);
student.use('/email', emailRouter);

student.post('/info', general.permiss(['info', 'choose']), info.setGeneralInfo(['resume']));

student.post('/choose', general.permiss(['choose', 'final']), subject.choose);

module.exports = student;