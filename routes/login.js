const mysql = require("./sql");


function login(req, res) {
    const student_account = req.body.account;
    const password = req.body.password;
    let login_sql = "SELECT * FROM student WHERE student_account = ?";
    const top_sql = "SELECT * FROM notice where top = 1 order by id DESC ";
    const nomal_sql = "SELECT * FROM notice where top = 0 order by id DESC limit ?";
    const count_top = "SELECT COUNT(id) AS total FROM notice where top = 1";
    let and_sql = "SELECT * FROM notice where top = 1 order by id DESC;SELECT * FROM notice where top = 0 order by id DESC limit ?";
    let student_name,student_profile,student_identity;
    let total = 0;
    mysql.find(login_sql, student_account)
        .then(data => {
                if (password === data[0].student_password) {
                    req.session.account = student_account;
                    student_name = data[0].student_name;
                    student_profile = data[0].student_profile;
                    student_identity = data[0].student_identity;

                    return mysql.find(count_top, [])

                }
            }
        ).then(
            data =>{
                total = data[0].total;
                return mysql.find(top_sql, 10-total);
            },err=>{
                console.log(err);
        }
    ).then(
       data => {
           console.log(data);
           let arr = new Array(total);
           for (let i = 0; i < total; i++) {
               delete data[i].id;
               //delete data[i].title;
               delete data[i].url;
               arr[i] = data[i]
           }
           res.render('user', {
                   user: {
                       name: student_name,
                       profile: student_profile,
                       identity: student_identity,
                   },
                   news: {
                       num: 34,
                       contents: arr
                   }

               }
           )
       })
}

module.exports = login;
