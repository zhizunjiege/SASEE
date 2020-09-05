/* mysql模块共分poolCluster->pool namespace->pool->connection四个级别
主要方法有query；
在connection级别上可以使用transaction事务，共有
transaction(callback(err))、commit(callback(err))、rollback(callback)三个方法可用
在connection层次上可以配置nestTables选项 */
const { host, port, user, password, database } = global.config.mysql;
const mysql = require('mysql');

const pool = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    multipleStatements: true, //配置true一次可以执行多条语句
    dateStrings: true,
    typeCast: (field, next) => {
        switch (field.type) {
            case 'JSON': return JSON.parse(field.string());
            case 'TINY': return field.string() == '1';
            default: return next();
        }
    }
});

function query(sql, param) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            if (err) {
                reject(err);
            } else {
                conn.query(sql, param, (err, rows, fields) => {
                    conn.release();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            }
        });
    });
}

function conn_query(sql, param) {
    return new Promise((resolve, reject) => {
        this._query(sql, param, (err, results, fields) => {
            if (err) {
                this.rollback(() => {
                    reject(err);
                })
            } else {
                resolve(results);
            }
        });
    });
}

function conn_commit() {
    return new Promise((resolve, reject) => {
        this._commit(err => {
            if (err) {
                this.rollback(() => {
                    reject(err);
                });
            } else {
                this.release();
                resolve();
            }
        });
    });
}

function transaction() {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            if (err) {
                reject(err);
            } else {
                conn.beginTransaction(err => {
                    if (err) {
                        reject(err);
                    } else {
                        conn._query = conn.query;
                        conn._commit = conn.commit;
                        conn.query = conn_query;
                        conn.commit = conn_commit;
                        resolve(conn);
                    }
                });
            }
        });
    });
}

module.exports = { query, transaction };