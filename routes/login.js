const mysql = require("./sql");


function login(req, res) {
    const account = req.body.account;
    const password = req.body.password;
    let login_sql = "SELECT * FROM student WHERE account = ?";
    const top_sql = "SELECT * FROM notice where top = 1 order by id DESC ";
    const nomal_sql = "SELECT * FROM notice where top = 0 order by id DESC limit ?";
    const count_top = "SELECT COUNT(id) AS total FROM notice where top = 1";
    let and_sql = "SELECT * FROM notice where top = 1 order by id DESC;SELECT * FROM notice where top = 0 order by id DESC limit ?";
    let name,profile,identity;
    let total = 0;
    mysql.find(login_sql, account)
        .then(data => {
                if (password === data[0].password) {
                    req.session.account = account;
                    name = data[0].name;
                    profile = data[0].profile;
                    identity = data[0].identity;

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
                       name: name,
                       profile: profile,
                       identity: identity,
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
