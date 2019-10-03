const mysql = require('./sql');

module.exports = (period) => {
    return (req, res) => {
        let { account } = req.session,
            { id, password } = req.body,
            colume = '';
        if (period.GET_STATE() == 5) {
            colume = 'selected';
        } else {
            colume = 'final';
        }
        let sql_query = 'SELECT id stuId,bysj FROM student WHERE account=? AND password=?',
            sql_update1 = 'UPDATE bysj SET student_' + colume + '=JSON_REMOVE(student_' + colume + ',JSON_UNQUOTE(JSON_SEARCH(student_' + colume + ',"one",?))) WHERE id=?',
            sql_update2 = 'UPDATE bysj SET student_' + colume + '=JSON_ARRAY_APPEND(student_' + colume + ',"$",CONCAT("",?)) WHERE id=?',
            sql_update3 = 'UPDATE student SET bysj=? WHERE id=?';
        mysql.find(sql_query, [account, password]).then(results => {
            if (results.length > 0) {
                let { stuId, bysj } = results[0];
                if (bysj && bysj == id) {
                    res.status(403).send('你已经选择过该课题！');
                } else {
                    mysql.transaction().then(conn => {
                        if (bysj) {
                            return conn.find(sql_update1, [stuId, bysj]);
                        } else {
                            return Promise.resolve({
                                results: 'succeeded!',
                                conn: conn
                            });
                        }
                    }).then(({ conn }) => {
                        return conn.find(sql_update2, [stuId, id]);
                    }).then(({ conn }) => {
                        return conn.find(sql_update3, [id, stuId]);
                    }).then(({ results, conn }) => {
                        return conn.commitPromise(results);
                    }).then(() => {
                        res.send('选择课题成功');
                    }).catch(err => {
                        console.log(err);
                        res.status(403).send('选择课题失败，请稍后重试！');
                    });
                }
            } else {
                res.status(403).send('密码错误，请重试！');
            }
        }).catch(err => {
            console.log(err);
            res.status(403).send('服务器错误，请重试！');
        });
    };
}