const mysql = superApp.requireUserModule('mysql'),
    { FILES } = superApp.resourses;

function download(req, res) {
    let { id, uploader, filename } = req.query,
        { identity } = req.session,
        sql_query = 'SELECT `group` FROM bysj WHERE id=?';
    mysql.find(sql_query, id).then(results => {
        let path = FILES + '/group' + results[0].group + '/subject' + id + '/' + (identity == 'teacher' ? 'student' : 'teacher') + '/' + (uploader ? uploader + '/' : '') + filename;
        res.download(path, err => {
            if (err) throw err;
        });
    }).catch(err => {
        console.log(err);
        res.status(403).send('出现错误，请稍后重试！');
    });
}

module.exports = { download };