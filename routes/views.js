const mysql = require("./sql");

function _render(res, sql_query, param, file) {
    if (sql_query) {
        mysql.find(sql_query, param).then(data => {
            res.render(file, { data });
        });
    } else if (file) {
        res.render(file, {});
    } else {
        res.end();
        console.log('页面渲染出错！');
    }
}

function common(Router) {
    const commonRouter = Router();
    const filePath = process.cwd() + '/resourses/common';
    commonRouter.get('/newsList', (req, res) => {
        let nextPageOffset = ((Number(req.query.nextPage) || 1) - 1) * 10,
            sql_query = 'SELECT * FROM news ORDER BY top DESC,id DESC LIMIT 10 OFFSET ?',
            param = nextPageOffset;
        _render(res, sql_query, param, filePath + '/views/newsList');
    });
    commonRouter.get('/newsContent', (req, res) => {
        let id = Number(req.query.id) || 0;
        _render(res, null, null, filePath + '/news/news_' + id);
    });
    return commonRouter;
}

function student(req, res) {
    let file = req.query.type,
        nextPageOffset = ((Number(req.query.nextPage) || 1) - 1) * 10,
        account = Number(req.session.account) || 0,
        group = Number(req.session.group) || 0,
        id = Number(req.query.id) || 0,
        sql_query = '',
        param;
    switch (file) {
        case 'newsList':
            //req.query.nextPage表示第几页
            sql_query = 'SELECT * FROM news ORDER BY top DESC,id DESC LIMIT 10 OFFSET ?';
            param = nextPageOffset;
            file = process.cwd() + '/resourses/common/views/newsList';
            console.log(param);
            break;
        case 'newsContent':
            file = process.cwd() + '/resourses/common/news/news_' + id;
            break;
        case 'userInfo':
            sql_query = 'SELECT * FROM student WHERE account =?';
            param = account;
            break;
        case 'subject':
        case 'subjectList':
            sql_query = 'SELECT bysj.id,title,`group`,chosen,capacity,submitTime,t.name teacher FROM bysj,teacher t WHERE `group`=? AND bysj.teacher=t.id ORDER BY lastModifiedTime DESC LIMIT 10 OFFSET ?';
            param = [group, nextPageOffset];
            break;
        case 'subjectContent':
            sql_query = 'SELECT * FROM bysj WHERE id=?;SELECT `name`,gender,proTitle,field,email,department_des FROM teacher t,bysj b WHERE b.id=? AND b.teacher=t.id';
            param = [id, id];
            break;
        case 'mySubject':
            sql_query = 'SELECT notice,assignment,teacherFiles,studentFiles FROM student stu,bysj WHERE stu.account=? AND stu.bysj=bysj.id;SELECT `profile`,t.`name`,t.gender,proTitle,department_des,field,office,t.email,tele,resume FROM teacher t,student stu,bysj WHERE stu.account=? AND stu.bysj=bysj.id AND bysj.teacher=t.id';
            param = [account, account];
            break;
        default: break;
    }
    _render(res, sql_query, param, file);
}

function teacher(Router, permiss) {
    const teacherRouter = Router();
    teacherRouter.get('/userInfo', (req, res) => {
        let account = Number(req.session.account) || 0,
            sql_query = 'SELECT * FROM teacher WHERE account =?',
            param = account;
        _render(res, sql_query, param, req.path.substring(1));
    })
    teacherRouter.get('/subject', permiss([1, 2, 3, 4, 5, 6, 7, 8, 9]), (req, res) => {
        let account = Number(req.session.account) || 0,
            sql_query = 'SELECT b.id,title,chosen,capacity,introduction,submitTime,lastModifiedTime FROM bysj b,teacher t WHERE account=? AND JSON_CONTAINS(t.bysj,CONCAT("",b.id))',
            param = account;
        _render(res, sql_query, param, req.path.substring(1));

    });
    teacherRouter.get('/mySubject', permiss([9]), (req, res) => {
        let id = Number(req.query.id) || 0,
            sql_query = 'SELECT notice,assignment,teacherFiles,studentFiles FROM bysj b WHERE b.id=?;SELECT specialty_des,`name`,gender,s.group_des,class,stuNum,GPA,email,WAS,AMS FROM student s,bysj b WHERE b.id=? AND JSON_CONTAINS(b.student_selected,CONCAT("",s.id))',
            param = [id, id];
        _render(res, sql_query, param, req.path.substring(1));
    });
    teacherRouter.get('/submitSubject', permiss([1, 3]), (req, res) => {
        _render(res, null, null, req.path.substring(1));
    });
    return teacherRouter;
}


function dean(req, res) {
    let file = req.query.type,
        nextPageOffset = ((Number(req.query.nextPage) || 1) - 1) * 10,
        account = Number(req.session.account) || 0,
        group = Number(req.session.group) || 0,
        id = Number(req.query.id) || 0,
        sql_query = '',
        param;
    switch (file) {
        case 'newsList':
            //req.query.nextPage表示第几页
            sql_query = 'SELECT * FROM news ORDER BY top DESC,id DESC LIMIT 10 OFFSET ?';
            param = nextPageOffset;
            file = process.cwd() + '/resourses/common/views/newsList';
            console.log(param);
            break;
        case 'newsContent':
            file = process.cwd() + '/resourses/common/news/news_' + id;
            break;
        case 'userInfo':
            sql_query = 'SELECT * FROM dean WHERE account =?';
            param = account;
            break;
        case 'subject':
        case 'subjectList':
            sql_query = 'SELECT bysj.id,title,`group`,chosen,capacity,submitTime,t.name teacher FROM bysj,teacher t WHERE `group`=? AND bysj.teacher=t.id ORDER BY lastModifiedTime DESC LIMIT 10 OFFSET ?';
            param = [group, nextPageOffset];
            break;
        case 'subjectContent':
            sql_query = 'SELECT * FROM bysj WHERE id=?;SELECT `name`,gender,proTitle,field,email,department_des FROM teacher t,bysj b WHERE b.id=? AND b.teacher=t.id';
            param = [id, id];
            break;
        default:
            break;
    }
    _render(res, sql_query, param, file);
}

function admin(req, res) {

}
module.exports = { common, student, teacher, dean, admin };