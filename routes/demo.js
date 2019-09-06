var action = require("./action")
var mysql = require("./sql")

// console.log('here we go');
// new Promise( resolve => {
//     setTimeout( () => {
//         resolve('hello');
//     }, 2000);
// })
//     .then( value => {
//         console.log(value);
//         return new Promise( resolve => {
//             setTimeout( () => {
//                 resolve('world');
//             }, 2000);
//         });
//     })
//     .then( value => {
//         console.log( value + ' world');
//     });
const account = '15031010';
const password = '15031010160311641X';
let login_sql = "SELECT * FROM final WHERE account = ?";
let find_teacher = "SELECT * FROM teacher WHERE account = ?";
mysql.find(find_teacher, 1).then(
    teacher_info => {
        console.log(teacher_info[0])
    }
)