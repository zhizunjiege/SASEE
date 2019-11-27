const multer = require('multer'),
    [mysql, file] = superApp.requireUserModules(['mysql', 'file']),
    { FILES } = superApp.resourses;

let receive = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, superApp.resourses.TMP);
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    })
}).single('file');

function upload(req, res) {
    let { id, tag } = req.body,
        { name, identity } = req.session,
        { filename, path } = req.file,
        sql_update = 'UPDATE bysj SET ' + identity + 'Files=JSON_ARRAY_INSERT(' + identity + 'Files,"$[0]",JSON_OBJECT("date",CURDATE(),"name",?,"' + (tag ? 'tag' : 'uploader') + '",?)) WHERE id=?;SELECT id,`group` FROM bysj WHERE id=?';
    mysql.find(sql_update, [filename, tag ? tag : name, id, id]).then(results => {
        let to = FILES + '/group' + results[1][0].group + '/subject' + results[1][0].id + '/' + identity + '/' + (tag ? '' : name + '/') + filename;
        file.move(path, to, err => {
            if (err) throw err;
            res.send('文件上传成功！');
        })
    }).catch(err => {
        console.log(err);
        res.status(403).send('文件上传失败，请稍后重试！');
    });
}

module.exports = { receive, upload };