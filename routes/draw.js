const mysql = require('./sql');

const groupArray = [
    {
        "num": 1,
        "result": null
    }, {
        "num": 2,
        "result": null
    }, {
        "num": 3,
        "result": null
    }, {
        "num": 4,
        "result": null
    }, {
        "num": 5,
        "result": null
    }
];
const MAX = 3;
let count = 0;

function _randomSelect(selected, capacity) {
    let len = selected.length,
        failed = [];
    if (len > capacity) {
        for (let i = 0; i < len - capacity; i++) {
            failed = failed.concat(selected.splice(Math.floor(Math.random() * selected.length), 1));
        }
    }
    return [selected, failed];
}

function draw(group) {
    let sql_query = 'SELECT id,student_selected, capacity FROM bysj WHERE `group` = ? AND JSON_LENGTH(student_final)=0';
    return mysql.find(sql_query, group).then(results => {
        let sql_update1 = 'UPDATE bysj s SET student_final=CASE s.id' + ' WHEN ? THEN ?'.repeat(results.length) + ' END WHERE `group`=' + group,
            sql_update2 = 'UPDATE student SET bysj=NULL WHERE id IN ',
            paramArray = [],
            failedStudents = [];
        console.log(sql_update1);
        if (results.length) {
            for (let i = 0; i < results.length; i++) {
                let [final, failed] = _randomSelect(results[i].student_selected, results[i].capacity);
                paramArray.push(results[i].id, JSON.stringify(final));
                failedStudents = failedStudents.concat(failed);
            }
            sql_update2 += '(' + failedStudents.join(',') + ')';
            console.log(sql_update2);

            return mysql.transaction().then(conn => {
                return conn.find(sql_update1, paramArray);
            }).then(({ results, conn }) => {
                return conn.find(sql_update2);
            }).then(({ results, conn }) => {
                return conn.commitPromise(results);
            }).then(results => {
                console.log(results);

            });
        } else {
            return Promise.resolve('该分组不需要抽签。');
        }
    });
}

function drawAll() {
    let promiseArray = [];
    for (let i = 0; i < groupArray.length; i++) {
        const group = groupArray[i];
        if (!group.result || group.result.status == 'rejected') {
            promiseArray.push(draw(group.num));
        }
    }
    console.log(promiseArray);

    if (promiseArray.length > 0) {
        console.log(`现在正在进行第${count}次抽签···`);

        if (count == MAX) {
            return Promise.reject(new Error('抽签失败！'));
        } else {
            count++;
            return allSettled(promiseArray).then(results => {
                for (let i = 0, j = 0; i < groupArray.length; i++) {
                    let group = groupArray[i];
                    if (!group.result || group.result.status == 'rejected') {
                        group.result = results[j++];
                    }
                }
                return drawAll();
            });
        }
    } else {
        return Promise.resolve('抽签成功！');
    }
}

function allSettled(promiseArray) {
    let len = promiseArray.length,
        results = new Array(len);
    return new Promise(resolve => {
        for (let i = 0; i < len; i++) {
            let index = i;
            promiseArray[i].then(value => {
                console.log(index, value);

                results[index] = {
                    status: 'fulfilled',
                    value
                };
            }).catch(reason => {
                console.log(index, reason);

                results[index] = {
                    status: 'rejected',
                    reason
                };
            }).finally(() => {
                let flag = true;
                for (let j = 0; j < len; j++) {
                    if (!results[j]) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    resolve(results);
                }
            });
        }
    });
}

module.exports = drawAll;