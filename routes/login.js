const mysql = require("./sql");
const cookies_time = 1000 * 60 * 10;

function login(req,res) {
    const account = req.body.account;
    const password = req.body.password;
    if (account == password) {
        res.cookie("account",account,{maxAge: cookies_time});
        const sql = "SELECT * FROM notice where top = 1 order by id DESC limit ? ";
        const sql2 = "SELECT * FROM notice where top = 0 order by id DESC limit ?";
        const sql3 = "SELECT COUNT(id) AS total FROM notice where top = 1";
        const get_info = "SELECT * FROM student where account = ?";
        const MAX_NUM = 10;
        mysql.query(sql3, [], function (err, data) {
            if (err) console.log(err)
            num = data[0].total
            mysql.query(sql, num, function (err, data) {
                if (err) console.log(err);
                data = JSON.parse(JSON.stringify(data))
                var arr = new Array(num)
                for (var i = 0; i < num; i++) {
                    delete data[i].id;
                    //delete data[i].title;
                    delete data[i].url;
                    arr[i] = data[i]
                }
                //console.log(arr)
                const num2 = MAX_NUM - num;
                if (num <= MAX_NUM) mysql.query(sql2, num2, function (err, data) {
                    if (err) console.log(err);
                    data = JSON.parse(JSON.stringify(data));
                    for (var i = 0; i < num2; i++) {
                        delete data[i].id;
                        //delete data[i].title;
                        delete data[i].url;
                        arr.push(data[i])
                    }
                    mysql.query(get_info, account, function (err, data) {
                        if (err) console.log(err);
                        data = JSON.parse(JSON.stringify(data));
                        console.log(data[0].name);
                        res.render('student', {
                            user: {
                                name: data[0].name,
                                gender: 'coder_chen',
                                identity: req.query.identity ? '教师' : '学生',
                            },
                            news: {
                                num: 34,
                                contents: arr
                            }
                        });
                    })

                })
            })
        })
    }
}
module.exports = login;