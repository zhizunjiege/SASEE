//mysql模块共分poolCluster->pool namespace->pool->connection四个级别
//主要方法有query；
//在connection级别上可以使用transaction事务，共有
//transaction(callback(err))、commit(callback(err))、rollback(callback)三个方法可用
//在connection层次上可以配置nestTables选项
let mysql = require('mysql');
let pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    multipleStatements: true, //配置true一次可以执行多条语句
    password: 'sasee2016',
    database: 'app',
    port: 3306,
    dateStrings: true,
    typeCast: (field, next) => {
        if (field.type == 'JSON') return JSON.parse(next());
        else return next();
    }
});

const query = pool.query;

const find = (sql, param) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            if (err) {
                reject(err);
            } else {
                conn.query(sql, param, (err, rows, fields) => {
                    conn.release();
                    if (err) reject(err);
                    else resolve(rows);
                });
            }
        });
    });
};

const transaction = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            if (err) {
                reject(err);
            }
            conn.beginTransaction((err) => {
                if (err) {
                    reject(err);
                };
                conn.find = (sql, param) => {
                    return new Promise((resolve, reject) => {
                        conn.query(sql, param, (err, results, fields) => {
                            if (err) {
                                return conn.rollback(() => {
                                    reject(err);
                                })
                            }
                            resolve({ results, conn });
                        });
                    });
                };
                conn.commitPromise = (results) => {
                    return new Promise((resolve, reject) => {
                        conn.commit((err) => {
                            if (err) {
                                return conn.rollback(() => {
                                    reject(err);
                                });
                            }
                            conn.release();
                            resolve(results);
                        });
                    });
                };
                resolve(conn);
            });
        });
    });
};

module.exports = { query, find, transaction };