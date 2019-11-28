const [mysql, util] = superApp.requireUserModules(['mysql', 'util']),
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
    }).catch(util.catchError(res));
}

module.exports = { download };