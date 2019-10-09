const mysql = require('./sql');

let STATE = 0;

function init() {
    let sql_query = 'SELECT state FROM period';
    mysql.find(sql_query).then((data) => {
        if (data.length == 0) {
            let sql_insert = 'INSERT INTO period (state,open) VALUES (0,NOW())';
            return mysql.find(sql_insert);
        } else {
            STATE = data[0].state;
        }
    }).then(() => {
        console.log('初始化成功！')
    });
}

function update(req, res) {
    let columeArray = ['open', 'submit', 'review', 'modify', 'release', 'choose', 'draw', 'publicity', 'final', 'general', 'close'],
        sql_update = 'UPDATE period SET state=state+1,??=NOW()';
    mysql.find(sql_update, columeArray[++STATE]).then(() => {
        res.send('更新成功！');
    });
}

function permiss(param) {
    let periodSet = new Set();
    if (Array.isArray(param) && param.length > 0) {
        for (const iterator of param) {
            if (Array.isArray(iterator)) {
                for (let i = iterator[0]; i <= iterator[1]; i++) {
                    periodSet.add(i);
                }
            } else {
                periodSet.add(iterator);
            }
        }
        return (req, res, next) => {
            if (periodSet.has(STATE)) {
                next();
            } else {
                res.status(403).send('现阶段无法进行该操作！');
            }
        };
    }
    throw new Error('参数错误！');
}

function GET_STATE() {
    return STATE;
}

module.exports = { init, update, permiss, GET_STATE };