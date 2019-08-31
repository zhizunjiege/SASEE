const mysql = require("./sql");

function get_group(id) {
    switch (id) {
        case -1 :
            return '未选择';
        case 0 :
            return '第一组';
        case 1:
            return '第二组';
        case 2:
            return '第三组'
    }
}

function login(req, res) {
    let not = [];
    const account = req.body.account;
    const password = req.body.password;
    let login_sql = "SELECT * FROM final WHERE account = ?";
    mysql.query(login_sql, account, function (err, data) {
        if (err) {
            res.setHeader('Content-Type', 'text/plain;charset=utf-8');
            return res.end('连接失败，请稍后重试')
        }
        ;
        const result1 = JSON.parse(JSON.stringify(data));
        //console.log(result1);
        //console.log('type', typeof (result1));
        if (result1.length == 0) {
            //console.log('this block')
            res.setHeader('Content-Type', 'text/plain;charset=utf-8');
            return res.end('该用户不存在，请检查输入')
        }
        ;
        let identity=(result1[0].identity||'').slice(-4)||'';
        //console.log(identity);
        let pass = account + result1[0].class+identity;
        if (pass == password) {
            let sql = "SELECT * FROM g WHERE category = ? order by id asc";
            mysql.query(sql, result1[0].category, function (err, data) {
                if (err) return res.end('网络出了点差错，请稍后重试');
                //console.log('data2',data)
                let result2 = JSON.parse(JSON.stringify(data));
                delete result2.category;
                delete result2.id;
                //console.log('result2', result2);
                //console.log('result1',result1);
                res.render('user', {
                    user: {
                        account: result1[0].account,
                        direction: result1[0].category,
                        name: result1[0].name,
                        profile: result1[0].profile,
                        group: result1[0].group
                    },
                    groups: result2
                });
            })
        } else {
            res.setHeader('Content-Type', 'text/plain;charset=utf-8');
            return res.end("密码错误，请返回重新输入")
        }
    });
}

module.exports = login;


