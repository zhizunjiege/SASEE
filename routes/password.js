const mysql = require('./sql');

function modify(req, res) {
    let { account, identity } = req.session,
        { oldPW, newPW } = req.body,
        sql_query='SELECT password FROM ?? WHERE account=?',
        sql_update = 'UPDATE ?? SET password=? WHERE account=?';
    mysql.find(sql_query,[identity,account]).then((results) => {
        if(oldPW==results[0].password){
            return mysql.find(sql_update,[identity,newPW,account]);
        }else {
            res.status(403).send('旧密码错误,请重试！');
        }
    }).then(()=>{
        if(!res.headersSent){
            req.session.destroy();
            res.send('修改密码成功！');
        }
    });
}
function retrieve(req, res) {

}

module.exports = { modify, retrieve };