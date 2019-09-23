const mysql = require("./sql");

function _render(res, sql_query, param, file) {
    if (sql_query) {
        mysql.find(sql_query, param).then(data => {
            console.log(data);
            res.render(file, { data });
        });
    } else if (file) {
        res.render(file, {});
    } else {
        res.end();
        console.log('页面渲染出错！');
    }
}

function common(req,res){

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
            param = [id,id];
            break;
        case 'mySubject':
            sql_query = 'SELECT notice,assignment,teacherFiles,studentFiles FROM student stu,bysj WHERE stu.account=? AND stu.bysj=bysj.id;SELECT `profile`,t.`name`,t.gender,proTitle,department_des,field,office,t.email,tele,resume FROM teacher t,student stu,bysj WHERE stu.account=? AND stu.bysj=bysj.id AND bysj.teacher=t.id';
            param = [account, account];
            break;
        default: break;
    }
    _render(res, sql_query, param, file);
}

function teacher(req, res) {
    let file = req.query.type,
        nextPageOffset = ((Number(req.query.nextPage) || 1) - 1) * 10,
        account = Number(req.session.account) || 0,
        // group = Number(req.session.group) || 0,//teacher不需要group
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
            sql_query = 'SELECT * FROM teacher WHERE account =?';
            param = account;
            break;
        case 'subject':
            sql_query = 'SELECT b.id,title,chosen,capacity,introduction,submitTime,lastModifiedTime FROM bysj b,teacher t WHERE account=? AND JSON_CONTAINS(t.bysj,CONCAT("",b.id))';
            param = account;
            break;
        case 'mySubject':
            sql_query = 'SELECT notice,assignment,teacherFiles,studentFiles FROM bysj b WHERE b.id=?;SELECT specialty_des,`name`,gender,s.group_des,class,stuNum,GPA,email,WAS,AMS FROM student s,bysj b WHERE b.id=? AND JSON_CONTAINS(b.student_selected,CONCAT("",s.id))';
            param = [id, id];
            break;
        default: break;
    }
    _render(res, sql_query, param, file);
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
            param = [id,id];
            break;
        default:
            break;
    }
    _render(res, sql_query, param, file);
}

function admin(req, res) {

}
module.exports = {common, student, teacher, dean, admin };