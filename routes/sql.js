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


const find = function (sql, param) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, conn) {
            if (err) {
                reject(err);
            } else {
                conn.query(sql, param, function (err, rows, fields) {

                    //释放连接
                    conn.release();
                    //传递Promise回调对象
                    if (err) reject(err);

                    //resolve(err, JSON.parse(JSON.stringify(rows)));
                    else resolve(JSON.parse(JSON.stringify(rows)));
                });
            }
        });
    });
};
exports.query = query;
exports.find = find;