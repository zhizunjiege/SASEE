const mysql = require("./sql");
const SqlString = require('sqlstring');


let group = [
    ['王', 'duan'],
    ['yu', 'tao'],
    ['qian', 'wu'],
    ['wang', 'xie'],
    ['chen', 'zhao'],
    ['li', 'du']
];


let select_course = function (group_id, info) {

};

let draw_slots = function () {
    // clean preselected
    // write into student
};

let left_course = function () {
    // find which final_list is less than capacity
    // return category course
};

let show_course = function (category, phase) {
    if (phase == 1) {
        let sql = "SELECT COUNT(category) AS selected FROM result where category = ?";
        mysql.query(sql, category, function (err,data) {
            if (err) console.log(err);
            return data[0].selected
        })
    }
};

let drop_course = function (course_id, account) {

};

