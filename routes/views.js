const mysql = require("./sql"),
    { paramIfValid } = require('./util');

function _render(res, sql_query, param, file) {
    if (sql_query && paramIfValid(param)) {
        mysql.find(sql_query, param).then(data => {
            res.render(file, { data });
        });
    } else if (file) {
        res.render(file, { data: '' }, (err, html) => {
            if (err) {
                console.log(err);
                res.status(403).send('页面渲染出错！');
            } else {
                res.send(html);
            }
        });
    } else {
        res.end();
    }
}

function common(Router) {
    const commonRouter = Router();
    commonRouter.get('/newsList', (req, res) => {
        let nextPageOffset = ((Number(req.query.page) || 1) - 1) * 10,
            sql_query = 'SELECT * FROM news ORDER BY top DESC,id DESC LIMIT 10 OFFSET ?';
        _render(res, sql_query, nextPageOffset, req.APP_CONSTANT.ROOT + req.APP_CONSTANT.VIEWS_COMMON + 'newsList');
    });
    commonRouter.get('/newsContent', (req, res) => {
        let id = req.query.id;
        _render(res, null, null, req.APP_CONSTANT.ROOT + req.APP_CONSTANT.PATH_NEWS + id);
    });
    return commonRouter;
}

function student(Router, period) {
    const studentRouter = Router();
    studentRouter.get('/userInfo', (req, res) => {
        let account = req.session.account,
            sql_query = 'SELECT * FROM student WHERE account =?';
        _render(res, sql_query, account, 'userInfo');
    });
    studentRouter.get('/subject', period.permiss([5, 8]), (req, res) => {
        let group = req.session.group,
            sql_query = 'SELECT (SELECT COUNT(*) FROM bysj WHERE bysj.state=1 AND `group`=?) total,b.id,`group`,title,chosen,capacity,submitTime,(SELECT name FROM teacher t WHERE t.id=b.teacher) teacher FROM bysj b WHERE b.state=1 AND `group`=? ORDER BY submitTime,b.id LIMIT 10 OFFSET 0';
        _render(res, sql_query, [group, group], 'subject');
    });
    studentRouter.get('/subjectList', period.permiss([5, 8]), (req, res) => {
        let nextPageOffset = ((Number(req.query.page) || 1) - 1) * 10,
            group = req.session.group,
            sql_query = 'SELECT b.id,`group`,title,chosen,capacity,submitTime,(SELECT name FROM teacher t WHERE t.id=b.teacher) teacher FROM bysj b WHERE b.state=1 AND `group`=? ORDER BY submitTime,b.id LIMIT 10 OFFSET ?';
        _render(res, sql_query, [group, nextPageOffset], 'subjectList');
    });
    studentRouter.get('/subjectContent', period.permiss([5, 8]), (req, res) => {
        let id = req.query.id,
            sql_query = 'SELECT * FROM bysj WHERE id=?;SELECT t.* FROM teacher t,bysj b WHERE b.teacher=t.id AND b.id=?';
        _render(res, sql_query, [id, id], 'subjectContent');
    });
    studentRouter.get('/mySubject', period.permiss([9]), (req, res) => {
        let account = req.session.account,
            sql_query = 'SELECT s.name stuName,b.id,notice,teacherFiles,studentFiles FROM bysj b,student s WHERE b.id=s.bysj AND s.account=?;SELECT t.* FROM teacher t,bysj b,student s WHERE s.account=? AND s.bysj=b.id AND b.teacher=t.id';
        _render(res, sql_query, [account, account], 'mySubject');
    });
    return studentRouter;
}

function teacher(Router, period) {
    const teacherRouter = Router();
    teacherRouter.get('/userInfo', (req, res) => {
        let account = req.session.account,
            sql_query = 'SELECT * FROM teacher WHERE account =?';
        _render(res, sql_query, account, 'userInfo');
    });
    teacherRouter.get('/subject', period.permiss([[1, 9]]), (req, res) => {
        let account = req.session.account,
            sql_query = 'SELECT b.id,title,chosen,capacity,introduction,submitTime,lastModifiedTime,state FROM bysj b,teacher t WHERE account=? AND JSON_CONTAINS(t.bysj,CONCAT("",b.id))';
        _render(res, sql_query, account, 'subject');
    });
    teacherRouter.get('/submitSubject', period.permiss([1]), (req, res) => {
        _render(res, null, null, 'submitSubject');
    });
    teacherRouter.get('/modifySubject', period.permiss([1, 3]), (req, res) => {
        let id = req.query.id,
            sql_query = 'SELECT id,title,`group`,capacity,introduction,materials FROM bysj WHERE id=?';
        _render(res, sql_query, id, 'submitSubject');
    });
    teacherRouter.get('/mySubject', period.permiss([9]), (req, res) => {
        let id = req.query.id,
            sql_query = 'SELECT id,notice,teacherFiles,studentFiles FROM bysj WHERE id=?;SELECT s.* FROM student s,bysj b WHERE b.id=? AND JSON_CONTAINS(b.student_final,CONCAT("",s.id))';
        _render(res, sql_query, [id, id], 'mySubject');
    });
    return teacherRouter;
}


function dean(Router, period) {
    const deanRouter = Router();
    deanRouter.get('/userInfo', (req, res) => {
        let account = req.session.account,
            sql_query = 'SELECT * FROM dean WHERE account =?';
        _render(res, sql_query, account, 'userInfo');
    });
    deanRouter.get('/subject', period.permiss([2, 4]), (req, res) => {
        let group = req.session.group,
            sql_query = 'SELECT (SELECT COUNT(*) FROM bysj WHERE bysj.state=0 AND `group`=?) total,b.id,`group`,title,chosen,capacity,submitTime,(SELECT name FROM teacher t WHERE t.id=b.teacher) teacher FROM bysj b WHERE b.state=0 AND `group`=? ORDER BY submitTime,b.id LIMIT 10 OFFSET 0';
        _render(res, sql_query, [group, group], '../../student/views/subject');
    });
    deanRouter.get('/subjectList', period.permiss([2, 4]), (req, res) => {
        let nextPageOffset = ((Number(req.query.page) || 1) - 1) * 10,
            group = req.session.group,
            sql_query = 'SELECT b.id,`group`,title,chosen,capacity,submitTime,(SELECT name FROM teacher t WHERE t.id=b.teacher) teacher FROM bysj b WHERE b.state=0 AND `group`=? ORDER BY submitTime,b.id LIMIT 10 OFFSET ?';
        _render(res, sql_query, [group, nextPageOffset], '../../student/views/subjectList');
    });
    deanRouter.get('/subjectContent', period.permiss([2, 4]), (req, res) => {
        let id = req.query.id,
            sql_query = 'SELECT * FROM bysj WHERE id=?;SELECT t.* FROM teacher t,bysj b WHERE b.teacher=t.id AND b.id=?';
        _render(res, sql_query, [id, id], 'subjectContent');
    });
    return deanRouter;
}

function admin(req, res) { }
module.exports = { common, student, teacher, dean, admin };