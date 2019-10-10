const mysql = require('./sql');


function Draw(id) {
    return new Promise(resolve => {
        let scheme_sql = 'SELECT student_selected, capacity FROM bysj WHERE id = ?';
        mysql.find(scheme_sql, id).then(SchemeInfo => {
            let list = shuffle(SchemeInfo[0]["student_selected"]);
            let capacity = SchemeInfo[0].capacity;
            if (capacity < 1) return console.log("容量设置错误");
            let num = list.length;
            while (num > capacity) {
                list.pop();
                // delete chosen in g;
                num -= 1;
            }
            resolve(list);
        });
    })
}

function Draw_all() {
    let all_scheme = 'SELECT id FROM bysj ';
    mysql.find(all_scheme, []).then(all => {
        console.log(all);
        let total = all.length;
        for (let i = 0; i < total; i++) {
            Draw(all[i].id).then(list => {
                console.log(all[i].id, list);
                list = '[' + list.toString() + ']';
                //write
                let update = "UPDATE bysj SET student_final = ? WHERE id = ?";
                mysql.find(update, [list, all[i]['id']]);
            })

        }
    })

}


function select(req, res) {
    //derive data
    let account = 222;
    let id = 1;
    //write into scheme
    let scheme_sql = 'SELECT * FROM scheme WHERE id = ?';
    mysql.find(scheme_sql, id).then(scheme_info => {
        let list = JSON.parse(scheme_info[0].selected);
        list.push(account);
        list = '[' + list.toString() + ']';
        console.log(list);
        let into_sql = 'UPDATE scheme SET selected = ? WHERE id = ?; UPDATE student SET graduate = ? WHERE account = ?';
        mysql.find(into_sql, [list, id, id, account]).then(success => {
            console.log('success');
        }, err => {
            console.log(err);
        })
    })
}

//select(1, 1);
//Draw(1);

function display_student(req, res) {
    //显示给学生可供选课的信息，如果已经选过该课程，则为灰色，不能选择；没有该选项；
    //derive data
    let account = 222;

}

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


module.exports = Draw_all;

// let test = "select student_selected from bysj where id = 1";
// mysql.find(test, []).then(data=>{
//     console.log(typeof data[0]);
//     console.log(data[0]["student_selected"][3]);
// });

Draw_all();
// let update = "UPDATE bysj SET student_final = ? WHERE id = ?";
// mysql.find(update, ['[]', 1]);