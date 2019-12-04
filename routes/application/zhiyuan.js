const superApp = require('../../config');
const mysql = superApp.requireUserModule('mysql');

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

const groupArray = [
    {
        "num":'自动控制与模式识别',
        "result": null
    }, {
        "num": '自主导航与精确制导',
        "result": null
    }, {
        "num": '检测与自动化过程',
        "result": null
    }, {
        "num": '飞行器控制与仿真',
        "result": null
    }, {
        "num": '机电控制与液压',
        "result": null
    }
];
const MAX = 3;
let count = 0;

function draw(group) {
    let find_student1 = 'SELECT account FROM student WHERE `group` = ? AND bysj is null AND target1 = ?',
        find_student2 = 'SELECT account FROM student WHERE `group` = ? AND bysj is null AND target2 = ?',
        find_student3 = 'SELECT account FROM student WHERE `group` = ? AND bysj is null AND target3 = ?',
        find_id = 'SELECT id FROM bysj WHERE `group` = ? AND student is null';
    let update_final = 'UPDATE bysj SET student = ?  WHERE id = ?',
        update_student = 'UPDATE student SET bysj = ? WHERE account = ?';
    let scheme1 = [], scheme2 = [], scheme3 = [];
    return mysql.find(find_id, group).then(list => {
        for (let i = 0; i < list.length; i++) {
            scheme1.push(each(list[i].id, 1));
        }
        return Promise.all(scheme1).then(next2 => {
            //console.log('need to draw target2', next2);
            return Promise.resolve(next2);
        })
    }).then(list => {
        for (let i = 0; i < list.length; i++) {
            if(list[i]!='success')
            scheme2.push(each(list[i], 2));
        }
        return Promise.all(scheme2).then(next3 => {
            //console.log('need to draw target3', next3);
            return Promise.resolve(next3);
        })
    }).then(list => {
        for (let i = 0; i < list.length; i++) {
            if(list[i]!='success')
            scheme3.push(each(list[i], 3));
        }
        return Promise.all(scheme3).then(next3 => {
            //console.log('target3 no in', next3);
            return Promise.resolve(next3);
        })
    }).then(result=>{
        let fail = [];
        for(let i = 0; i < result.length; i++) {
            if (result[i] != 'success') {
                fail.push(result[i]);
            }
        }if (fail.length == 0) {
            console.log('success');
            return Promise.resolve('该分组抽签完成');
        }else {
            //console.log(fail);
            fail.push('以上为未抽中');
            return Promise.resolve(fail);
        }
    });

    function each(id, n) {
        let selected = [],
            final, fail;
        let sql = [find_student1, find_student2, find_student3];
        //console.log(sql[n-1]);
        return mysql.find(sql[n - 1], [group, id]).then(list => {
            for (let i = 0; i < list.length; i++) {
                selected.push(list[i].account);
            }
            if (selected.length == 0) {
                return id
            }
            [final, fail] = _randomSelect(selected, 1);
            return mysql.transaction().then(conn => {
                console.log('抽中的学生,',final,'课题',id);
                return conn.find(update_final, [final, id]);
            }).then(({conn}) => {
                return conn.find(update_student, [id, final]);
            }).then(({results, conn}) => {
                return conn.commitPromise(results);
            }).then(()=>{
                return 'success'
            })
        })
    }
}



function drawAll() {
    let promiseArray = [];
    for (let i = 0; i < groupArray.length; i++) {
        const group = groupArray[i];
        if (!group.result || group.result.status == 'rejected') {
            promiseArray.push(draw(group.num));
        }
    }
    if (promiseArray.length > 0) {
        console.log(`现在正在进行第${count + 1}次抽签···`);
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
                results[index] = {
                    status: 'fulfilled',
                    value
                };
            }).catch(reason => {
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


module.exports = { drawAll };
