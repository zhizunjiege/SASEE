const mysql = require("./sql");
const SqlString = require('sqlstring');


let group = [
    ['王', 'duan'],
    ['yu', 'tao'],
    ['qian', 'wu'],
    ['wang', 'xie'],
    ['chen', 'zhao'],
    ['li', 'du']
]


let select_course = function (group_id, info) {
    info.group = group_id;
    info.teacher = group[info.category][group_id];
    id = info.category.toString() + group_id.toString()
    let sql_ = SqlString.format('INSERT INTO result SET ?', info);
    mysql.query(sql_, [], function (err, data) {
        if (err) console.log(err);
        let sql = "UPDATE groups SET chosen = chosen + 1 WHERE id = ?"
        mysql.query(sql, id, function (err, data) {
            if (err) console.log(err);
            res.end(1);
        })
    })
};

let draw_slots = function () {
    // clean preselected
    // write into student
};

let left_course = function () {
    // find which final_list is less than capacity
    // return category course
};

let show_course = function (category, phase = 1) {
    if (phase == 1) {
        let sql = "SELECT COUNT(category) AS selected FROM result where category = ?";
        mysql.query(sql, category, function (err, data) {
            if (err) console.log(err);
            return data[0].selected
        })
    }
};

let drop_course = function (course_id, account) {

};
exports.select_course = select_course;
exports.show_course = show_course;
