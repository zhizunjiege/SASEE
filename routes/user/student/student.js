const express = require('express'),
    [general, login, views, period, upload, download, info, email, password, subject] = superApp.requireUserModules([
        'general',
        'login',
        'views',
        'period',
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
    fileRouter = express.Router();

student.set('views', VIEWS_STUDENT);
student.use(general.auth({ url: '/', identity: 'student' }));
student.get('/', login.render);
student.use('/views', views.common, views.student);

fileRouter.post('/upload', upload.receive, upload.upload);
fileRouter.get('/download', download.download);
student.use('/file', period.permiss([9]), fileRouter);

emailRouter.get('/sendPinCode', period.permiss([0]), email.sendPinCode);
emailRouter.post('/setEmailAddr', period.permiss([0]), info.setEmailAddr);
emailRouter.post('/sendEmail', period.permiss([9]), email.sendEmail);
student.use('/email', emailRouter);

student.post('/choose', period.permiss([5, 8]), (req, res, next) => {
    if (period.GET_STATE() == 5) {
        req.body.colume = 'selected';
    } else {
        req.body.colume = 'final';
    }
    next();
}, subject.choose);

student.get('/logout', general.logout());
student.post('/password', password.modify);

module.exports = student;