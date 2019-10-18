const mysql = require('./sql'),
    schedule = require("node-schedule"),
    script = require('./script');

const _stateObj = {
    state: 0,
    curJob: schedule.scheduledJobs
};
const _periodArray = [
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

_periodArray.forEach(value => {
    value.job = script[value.period];
});

function init(callback) {
    let sql_query = 'SELECT * FROM period';
    mysql.find(sql_query).then((data) => {
        if (data.length == 0) {
            let sql_insert = 'INSERT INTO period (state,open) VALUES (0,NOW());SELECT * FROM period';
            return mysql.find(sql_insert);
        } else {
            return Promise.resolve([null, data]);
        }
    }).then(results => {
        _periodArray.forEach(value => {
            let startTime = results[1][0][value.period];
            value.startTime = startTime ? new Date(startTime) : null;
        });
        _stateObj.state = results[1][0].state;
        _registerSchedule();
        console.log('系统初始化成功！');
        callback();
    }).catch(err => {
        console.log(err);
    });
}

function _registerSchedule() {
    let state = _stateObj.state,
        start = _periodArray[state].startTime,
        end = _periodArray[state + 1].startTime,
        jobArray = _periodArray[state].job,
        immFunc = null;
    for (const iterator of jobArray) {
        if (iterator.time == 0) {
            immFunc = iterator.func;
        } else if (iterator.time > 0) {
            schedule.scheduleJob(new Date(start.getTime() + iterator.time), iterator.func);
        } else {
            end && schedule.scheduleJob(new Date(end.getTime() + iterator.time), iterator.func);
        }
    }
    end && schedule.scheduleJob(end, () => {
        let sql_update = 'UPDATE period SET state=?';
        mysql.find(sql_update, _stateObj.state + 1).then(() => {
            _stateObj.state++;
            _cancelSchedule();
            _registerSchedule();
        }).catch(err => {
            console.log(err);
        });
    });
    immFunc && immFunc();
}

function _cancelSchedule() {
    for (const iterator of Object.values(_stateObj.curJob)) {
        iterator.cancel();
    }
}

function updateNext(req, res) {
    let oldNextPeriodTime = _periodArray[_stateObj.state + 1].startTime,
        paramObj = {},
        sql_update = 'UPDATE period SET ?';
    for (let i = _stateObj.state + 1; i < _periodArray.length; i++) {
        const period = _periodArray[i].period;
        paramObj[period] = req.body[period].replace('T', ' ');
    }
    mysql.find(sql_update, paramObj).then(() => {
        for (let i = _stateObj.state + 1; i < _periodArray.length; i++) {
            const element = _periodArray[i];
            element.startTime = new Date(req.body[element.period]);
        }
        if (!oldNextPeriodTime || Math.abs(oldNextPeriodTime.getTime() - _periodArray[_stateObj.state + 1].startTime.getTime()) > 1 * 60 * 1000) {
            _cancelSchedule();
            _registerSchedule();
        }
        res.send('时间设置更新成功！');
    }).catch(err => {
        console.log(err);
        res.status(403).send('操作出错，请稍后重试！');
    });
}

function updateImm(req, res) {
    let nextState = _stateObj.state + 1,
        sql_update = 'UPDATE period SET state=?,??=?',
        now = new Date();
    mysql.find(sql_update, [nextState, _periodArray[nextState].period, now.toLocaleString()]).then(() => {
        _periodArray[++_stateObj.state].startTime = now;
        _cancelSchedule();
        _registerSchedule();
        res.send('立即启动成功！');
    }).catch(err => {
        console.log(err);
        res.status(403).send('操作出错，请稍后重试！');
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
            if (periodSet.has(_stateObj.state)) {
                next();
            } else {
                res.status(403).send('现阶段无法进行该操作！');
            }
        };
    }
    throw new Error('参数错误！');
}

function GET_STATE() {
    return _stateObj.state;
}
function GET_PERIODARRAY() {
    return _periodArray;
}

module.exports = { init, permiss, updateImm, updateNext, GET_STATE, GET_PERIODARRAY };