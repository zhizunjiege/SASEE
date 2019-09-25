const mysql = require('./sql');

function submit(req, res) {
    console.log(req.body);
    console.log(req.session);
    console.log(req.file);
    let group_desArray = ['自动控制与模式识别', '自主导航与精确制导', '检测与自动化工程', '飞行器控制与仿真', '机电控制与液压'];
    let body = req.body,
        title = body.title,
        group = Number(body.group),
        group_des = group_desArray[group - 1],
        capacity = Number(body.capacity),
        introduction = body.introduction,
        materials = JSON.stringify([{
            url: req.file.path,
            name: req.file.filename
        }]),
        paramArray = [title, group, group_des, capacity, introduction, materials];
    let sql_query = 'SELECT id FROM teacher WHERE account=?',
        sql_insert = 'INSERT INTO bysj (title,`group`,group_des,capacity,introduction,materials,submitTime,lastModifiedTime,teacher,state) VALUES (?,?,?,?,?,?,CURDATE(),CURDATE(),?,0);SELECT * FROM bysj WHERE id=LAST_INSERT_ID()',
        sql_update ='UPDATE teacher SET bysj=JSON_ARRAY_APPEND(bysj,"$",?) WHERE teacher.id=?',
        teacher_id;
    mysql.find(sql_query, req.session.account).then((data) => {
        teacher_id=data[0].id;
        paramArray.push(teacher_id);
        return mysql.find(sql_insert, paramArray);
    }).then((data) => {
        mysql.find(sql_update,[data[0].insertId,teacher_id]).then(()=>{
            res.render('subject-card', data[1][0]);
        });
    });
};

function modify(req,res){

}

module.exports = {submit,modify};