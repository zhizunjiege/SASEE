const mysql = require('./sql'),
    file = require('./file');

function student(req, res) { }

function teacher(req, res) {
    let { id, tag } = req.body,
        name = req.file.filename,
        sql_update = 'UPDATE bysj SET teacherFiles=JSON_ARRAY_INSERT(teacherFiles,"$[0]",JSON_OBJECT("date",CURDATE(),"name",?,"tag",?)) WHERE id=?;SELECT id,`group` FROM bysj WHERE id=?';
    mysql.find(sql_update, [name, tag, id, id]).then(results => {
        let from = req.file.path,
            to = req.APP_CONSTANT.PATH_FILES + 'group' + results[1][0].group + '/subject' + results[1][0].id + '/teacher/' + req.file.filename;
        file.move(from, to, err => {
            if (err) throw err;
            res.send('文件上传成功！');
        })
    }).catch(err => {
        res.status(403).send('文件上传失败，请稍后重试！');
    });
}

module.exports = { student, teacher };