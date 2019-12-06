const mysql = superApp.requireUserModule('mysql');

function _randomSelect(selected) {
    let len = selected.length,
        final = 0;
    if (len) {
        final = selected.splice(Math.floor(Math.random() * len), 1);
    }
    return [final, selected];//final为数组，抽中的学生id；selected为数组，未中的学生id
}

const MAX = 3;
let count = 0;

//对所有分组进行抽签
function draw() {
    let find_id = 'SELECT id FROM bysj WHERE state="1-通过" AND student IS NULL',
        update_clear = 'UPDATE student SET target1=NULL,target2=NULL,target3=NULL';
    let scheme1 = [], scheme2 = [], scheme3 = [];

    return mysql.transaction().then(conn => {
        return conn.find(find_id);
    }).then(({ results, conn }) => {
        for (let i = 0; i < results.length; i++) {
            scheme1.push(each(conn, results[i].id, 1));
        }
        return Promise.all(scheme1).then(results => {
            return Promise.resolve({ results, conn });
        });
    }).then(({ results, conn }) => {
        for (let i = 0; i < results.length; i++) {
            if (results[i] != 'success')
                scheme2.push(each(conn, results[i], 2));
        }
        return Promise.all(scheme2).then(results => {
            return Promise.resolve({ results, conn });
        });
    }).then(({ results, conn }) => {
        for (let i = 0; i < results.length; i++) {
            if (results[i] != 'success')
                scheme3.push(each(conn, results[i], 3));
        }
        return Promise.all(scheme3).then(results => {
            return Promise.resolve({ results, conn });
        });
    }).then(({ conn }) => {
        return conn.find(update_clear);
    }).then(({ conn }) => {
        return conn.commitPromise();
    });
}

//某一课题进行第n志愿抽签
function each(conn, id, n) {
    let find_student = `SELECT id FROM student WHERE bysj IS NULL AND target${n} = ?`,
        update_final = 'UPDATE bysj SET student = ? WHERE id = ?',
        update_student = `UPDATE student SET bysj = ? WHERE id = ?`;
    let selected = [], final;

    return conn.find(find_student, id).then(({ results, conn }) => {
        for (let i = 0; i < results.length; i++) {
            selected.push(results[i].id);
        }
        if (selected.length == 0) {
            return Promise.resolve(id);
        }
        [[final]] = _randomSelect(selected);
        return conn.find(update_final, [final, id]).then(() => {
            return conn.find(update_student, [id, final]);
        }).then(() => {
            return Promise.resolve('success');
        });
    });
}

//对所有分组进行抽签，如出错，最多抽MAX次
function drawAll() {
    console.log(`正在进行第${count + 1}次抽签···`);
    return draw().then(() => {
        console.log('抽签成功！');
    }).catch(err => {
        console.log(err);
        if (count == MAX) {
            return Promise.reject('抽签失败！');
        } else {
            count++;
            return drawAll();
        }
    });
}

module.exports = { drawAll };
