const mysql = require("./sql");
const SqlString = require('sqlstring');
const aim_table = 'course2017';




let new_course = function () {
    // write data into database
    var data = {
        course_id: 1,
        course_name: "first",
        course_category: 403,
        course_teacher: "diracle",
        preselected_list: [null],
        final_list: [null],
        capacity: 4
    };
    let sql = "INSERT INTO course2017 SET ?";
    var sql_ = SqlString.format('INSERT INTO course2017 SET ?', data)
    mysql.query(sql_, [],function (err, data) {
        if (err) console.log(err);
    })
};

let select_course = function (course_id, account) {
    // update preselected list
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

    }
};

let drop_course = function (course_id, account) {

};

new_course();