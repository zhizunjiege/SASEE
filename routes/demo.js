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
mysql.find(login_sql, account)
    .then(
        result1 => {
            if (result1.length == 0) {
                console.log('该用户不存在');
            }
            let identity = (result1[0].identity || '').slice(-4) || '';
            //console.log(identity);
            let pass = account + result1[0].class + identity;
            console.log(pass);
            if (pass == password)
                return new Promise((resolve) => {
                    let sql = "SELECT * FROM g WHERE category = ? order by id asc";
                    mysql.find(sql, result1[0].category).then(
                        data => {
                            resolve(data)
                        }, err => {
                            console.log(err);
                        }
                    )
                })
        }, err => {
            console.log(err);
        }
    ).then(
    get_data => {
        console.log(get_data[0]);
    }
)