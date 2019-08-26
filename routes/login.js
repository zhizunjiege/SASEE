var mysql = require("./sql")
function login(req, res) {
    var account = req.body.account;
    var password = req.body.password;
    if (account == password) {
        var sql = "SELECT * FROM notice where top = 1 order by id DESC limit ? "
        var sql2 = "SELECT * FROM notice where top = 0 order by id DESC limit ?"
        var sql3 = "SELECT COUNT(id) AS total FROM notice where top = 1"
        var num2 = 3
        const MAX_NUM = 10
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
                if (num <= MAX_NUM) mysql.query(sql2, num2, function (err, data) {
                    if (err) console.log(err);
                    data = JSON.parse(JSON.stringify(data))
                    for (var i = 0; i < num2; i++) {
                        delete data[i].id;
                        //delete data[i].title;
                        delete data[i].url;
                        arr.push(data[i])
                    }
                    console.log(arr);
                    var id = req.body.identity;
                    res.render('user', {
                        user: {
                            name: '333',
                            profile: 'coder_chen.png',
                            identity: id
                        },
                        news: {
                            num: 34,
                            contents: arr
                        },
                        teacher:{
                            used:[true,false,false]
                        }
                    }); return;
                })
            })
        })
    }
}
module.exports = login;