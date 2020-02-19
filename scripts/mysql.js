/* mysql模块共分poolCluster->pool namespace->pool->connection四个级别
主要方法有query；
在connection级别上可以使用transaction事务，共有
transaction(callback(err))、commit(callback(err))、rollback(callback)三个方法可用
在connection层次上可以配置nestTables选项 */
const mysql = require('mysql');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    multipleStatements: true, //配置true一次可以执行多条语句
    password: 'sasee2016',
    database: 'app',
    port: 3306,
    dateStrings: true,
    typeCast: (field, next) => {
        switch (field.type) {
            case 'JSON': return JSON.parse(field.string());
            case 'TINY': return field.string() == '1';
            default: return next();
        }
    }
});

function find(sql, param) {
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
}

function _find(sql, param) {
    return new Promise((resolve, reject) => {
        this.query(sql, param, (err, results, fields) => {
            if (err) {
                return this.rollback(() => {
                    reject(err);
                })
            }
            resolve(results);
        });
    });
}

function _commit() {
    return new Promise((resolve, reject) => {
        this.commit((err) => {
            if (err) {
                return this.rollback(() => {
                    reject(err);
                });
            }
            this.release();
            resolve();
        });
    });
}

function transaction() {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            if (err) {
                reject(err);
            }
            conn.beginTransaction((err) => {
                if (err) {
                    reject(err);
                };
                conn.find = _find;
                conn.commitPromise = _commit;
                resolve(conn);
            });
        });
    });
}

module.exports = { find, transaction };