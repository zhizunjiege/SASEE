const mysql = require('./sql');

let STATEOBJ = null;
const PERIODARRAY = [
    { period: "open", des: '系统开启' },
    { period: "submit", des: '提交课题' },
    { period: "review", des: '初次审核' },
    { period: "modify", des: '课题修改' },
    { period: "release", des: '二次审核' },
    { period: "choose", des: '学生选题' },
    { period: "draw", des: '系统抽签' },
    { period: "publicity", des: '数据公示' },
    { period: "final", des: '补选改选' },
    { period: "general", des: '选题完成' },
    { period: "close", des: '系统关闭' }
];

function init() {
    let sql_query = 'SELECT * FROM period';
    mysql.find(sql_query).then((data) => {
        if (data.length == 0) {
            let sql_insert = 'INSERT INTO period (state,open) VALUES (0,NOW());SELECT * FROM period';
            return mysql.find(sql_insert);
        } else {
            return Promise.resolve([null, data]);
        }
    }).then(results => {
        delete results[1][0].id;
        STATEOBJ = JSON.parse(JSON.stringify(results[1][0]));
        console.log('初始化成功！');
    });
}

function update(req, res) {
    let sql_update = 'UPDATE period SET state=state+1,??=NOW()';
    mysql.find(sql_update, PERIODARRAY[++STATEOBJ.state].period).then(() => {
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
            if (periodSet.has(STATEOBJ.state)) {
                next();
            } else {
                res.status(403).send('现阶段无法进行该操作！');
            }
        };
    }
    throw new Error('参数错误！');
}

function GET_STATE() {
    return STATEOBJ.state;
}
function GET_STATEOBJ() {
    return STATEOBJ;
}
function GET_PERIODARRAY() {
    return PERIODARRAY;
}

module.exports = { init, update, permiss, GET_STATE, GET_STATEOBJ, GET_PERIODARRAY };