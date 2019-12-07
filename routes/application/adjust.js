const mysql = superApp.requireUserModule('mysql');

const MAX = 3;
let count = 0;

function shuffle(array) {
    let m = array.length,
        t, i;
    // 如果还剩有元素…
    while (m) {
        // 随机选取一个元素…
        i = Math.floor(Math.random() * m--);
        // 与当前元素进行交换
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

function adjust(group) {
    let find_student = 'SELECT id FROM student WHERE `group`=? AND bysj IS NULL';
    let find_id = `SELECT id FROM bysj WHERE student IS NULL ${group == superApp.groupMap[6] ? '' : `AND \`group\` = "${group}"`}`;
    let student = [], student_ = [];
    let id = [], id_ = [];
    let scheme = [];
    return mysql.find(find_student, group).then(res => {
        let len = res.length;
        for (let i = 0; i < len; i++) {
            student.push(res[i].id);
        }
        return mysql.find(find_id).then(res => {
            let len = res.length;
            for (let i = 0; i < len; i++) {
                id.push(res[i].id);
            }
        });
    }).then(() => {
        id = shuffle(id);
        let len = Math.min(id.length, student.length);
        for (let i = 0; i < len; i++) {
            scheme.push(every(student[i], id[i]));
        }
        return Promise.all(scheme);
    }).then(() => {
        return mysql.find(find_student, group).then(res => {
            let len = res.length;
            for (let i = 0; i < len; i++) {
                student_.push(res[i].id);
            }
            return mysql.find(find_id).then(res => {
                let len = res.length;
                for (let i = 0; i < len; i++) {
                    id_.push(res[i].id);
                }
            });
        }).then(() => {
            let left = student_.length < id_.length ? id_ : student_;
            let head = student_.length < id_.length ? '课题剩余' : '学生剩余';
            left.unshift(head);
            if (student_.length * id_.length != 0) {
                count++;
                if (count == MAX) {
                    return Promise.reject('调剂失败');
                }
                return adjust(group);
            }
            return Promise.resolve(left);
        })
    });

    function every(stuId, id) {
        let update_student = 'UPDATE student SET bysj = ? WHERE id = ?';
        let update_scheme = "UPDATE bysj SET student = ? WHERE id = ?";
        return mysql.transaction().then(conn => {
            return conn.find(update_student, [id, stuId]);
        }).then(({ conn }) => {
            return conn.find(update_scheme, [stuId, id]);
        }).then(({ results, conn }) => {
            return conn.commitPromise(results);
        })
    }
}

function adjustAll() {
    return adjust(superApp.groupMap[0]).then(res => {
        console.log(res);
        return adjust(superApp.groupMap[1]);
    }).then(res => {
        console.log(res);
        return adjust(superApp.groupMap[2]);
    }).then(res => {
        console.log(res);
        return adjust(superApp.groupMap[3]);
    }).then(res => {
        console.log(res);
        return adjust(superApp.groupMap[4]);
    }).then(res => {
        console.log(res);
        return adjust(superApp.groupMap[5]);
    }).then(res => {
        console.log(res);
        return adjust(superApp.groupMap[6]);
    }).then(res => {
        console.log(res);
    }).catch(err => {
        console.log(err);
    });
}

module.exports = adjustAll;