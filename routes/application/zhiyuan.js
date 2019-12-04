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

function check(list) {
    let find_student = [];
    if (list == null) {
        return Promise.resolve(find_student)
    }
    //if (list==null){return find_student}
    let find_no = 'SELECT * FROM student WHERE bysj is null AND account IN ' + '(' + list.toString() + ')';
    return mysql.find(find_no, list).then(result => {
        let n = 0;
        while (n < result.length) {
            find_student.push(result[n]['account']);
            n++;
        }
        return (find_student)
    });
}



// let n = [];
// n.push(check([16000000]));
// n.push(check([16000000,17000000]));
// Promise.all(n).then(res=>{
//     console.log(res);
// });


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
draw('机电控制与液压');

// let sql = 'SELECT account FROM student WHERE `group` = ? AND bysj is null AND target2 = ?';
// mysql.find(sql,['机电控制与液压',1]).then(s=>{console.log(s)});