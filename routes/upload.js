const mysql = require('./sql'),
    file = require('./file');

module.exports = (req, res) => {
    let { id, tag } = req.body,
        { name, identity } = req.session,
        { filename, path } = req.file,
        sql_update = 'UPDATE bysj SET ' + identity + 'Files=JSON_ARRAY_INSERT(' + identity + 'Files,"$[0]",JSON_OBJECT("date",CURDATE(),"name",?,"' + (tag ? 'tag' : 'uploader') + '",?)) WHERE id=?;SELECT id,`group` FROM bysj WHERE id=?';
    mysql.find(sql_update, [filename, tag ? tag : name, id, id]).then(results => {
        let to = req.APP_CONSTANT.PATH_FILES + 'group' + results[1][0].group + '/subject' + results[1][0].id + '/' + identity + '/' + (tag ? '' : name + '/') + filename;
        file.move(path, to, err => {
            if (err) throw err;
            res.send('文件上传成功！');
        })
    }).catch(err => {
        console.log(err);
        res.status(403).send('文件上传失败，请稍后重试！');
    });
};

/* function teacher(req, res) {
    let { id, tag } = req.body,
        { filename, path } = req.file,
        sql_update = 'UPDATE bysj SET teacherFiles=JSON_ARRAY_INSERT(teacherFiles,"$[0]",JSON_OBJECT("date",CURDATE(),"name",?,"tag",?)) WHERE id=?;SELECT id,`group` FROM bysj WHERE id=?';
    mysql.find(sql_update, [filename, tag, id, id]).then(results => {
        let to = req.APP_CONSTANT.PATH_FILES + 'group' + results[1][0].group + '/subject' + results[1][0].id + '/teacher/' + filename;
        file.move(path, to, err => {
            if (err) throw err;
            res.send('文件上传成功！');
        })
    }).catch(err => {
        res.status(403).send('文件上传失败，请稍后重试！');
    });
}

module.exports = { student, teacher }; */