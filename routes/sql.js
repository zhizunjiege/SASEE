var mysql = require("mysql");
var pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    multipleStatements: true, //配置true一次可以执行多条语句
    password: 'mysql',
    database: 'app',
    port: 3306
});

var query = function (sql, params, callback) {
    pool.getConnection(function (err, conn) {
        if (err) {
            callback(err, null, null);
        } else {
            conn.query(sql, params, function (none, vals, fields) {
                //释放连接
                conn.release();
                //事件驱动回调
                callback(none, vals, fields);
            });
        }
    });
};
var find = function (num, params, callback) {
    const find_sql = "SELECT COUNT(*) AS Num FROM notice"
    pool.getConnection(function (err, conn) {
        if (err) {
            callback(err, null, null);
        } else {
            conn.query(find_sql, params, function (none, vals, fields) {
                //释放连接
                conn.release();
                //事件驱动回调
                callback(none, vals, fields);
            });
        }
    })

}
exports.query = query;