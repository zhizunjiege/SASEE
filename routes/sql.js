//mysql模块共分poolCluster->pool namespace->pool->connection四个级别
//主要方法有query；
//在connection级别上可以使用transaction事务，共有
//transaction(callback(err))、commit(callback(err))、rollback(callback)三个方法可用
//在connection层次上可以配置nestTables选项

var mysql = require("mysql");
var pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    multipleStatements: true, //配置true一次可以执行多条语句
    password: 'mysql',
    database: 'app',
    port: 3306,
    dateStrings:true,
    typeCast: (field, next) => {
        if (field.type == 'JSON') return JSON.parse(next());
        else return next();
    }
});

const find = function (sql, param) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, conn) {
            if (err) {
                reject(err);
            } else {
                conn.query(sql, param, function (err, rows, fields) {
                    conn.release();
                    if (err) reject(err);
                    else resolve(rows);
                });
            }
        });
    });
};
exports.query = pool.query;
exports.find = find;