var action = require("./action")
var mysql = require("./sql")
const SqlString = require('sqlstring');


let group = [];



let info = {};
let account = req.body.account;
let category = req.body.direction;
let selection = req.body.group;
info.teacher = group_term[category][selection];
info.group = selection;
// selection is new, group is old choice;


if (group == -1) {
    let choose_sql = SqlString.format('UPDATE final  SET ? WHERE account = ?', [info, account]);
    // +=1
}
else if (selection ==group ){
    //res.send('你已经选择该课程');
}   else {
    let choose_sql = SqlString.format('UPDATE final  SET ? WHERE account = ?', [info, account]);
    // no +=1
}



if(err) res.end();
else if (data[0].group > -1)
{res.end('你已经选过课程了');console.log('already chosen')}
else mysql.query(choose_sql, [],function (err, data) {
        if (err) console.log(err)//res.end(0);
        let sql = "UPDATE g SET chosen = chosen + 1 WHERE id = ?"
        mysql.query(sql, id, function (err, data) {
            if(err) console.log(err)//res.end(0);
            else res.end('1');
        })
    })