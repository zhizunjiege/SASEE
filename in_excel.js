const superApp = require('./config');
const mysql = superApp.requireUserModule('mysql');

let xlsx = require('node-xlsx');

// 解析得到文档中的所有 sheet
let sheets = xlsx.parse('1.xls');

// 遍历 sheet
sheets.forEach(function (sheet) {
    //console.log(sheet);
    // 读取每行内容
    // for(let rowId in sheet['data']){
    //     console.log(rowId);
    //     let row=sheet['data'][rowId];
    //     console.log(row);
    // }
    let data = [];
    let index = sheet['data'][0];
    let account_id = index.indexOf("职工号");
    let name_id = index.indexOf('教师姓名');
    let gender_id = index.indexOf('性别');
    for (let rowId in sheet['data']) {
        if (rowId != 0) {
            let account = sheet['data'][rowId][account_id],
                name = remove_space(sheet['data'][rowId][name_id]),
                gender = sheet['data'][rowId][gender_id];
            data.push([account, gender,name]);
        }
    }
    let scheme = [];
    for (let i = 0; i < data.length; i++) {
        scheme.push(my_update(data[i]));
    }
    Promise.all(scheme).then(res=>{
        console.log(res);
    },err=>{
        console.log(err);
    });
    function my_update(data) {
        return mysql.transaction().then(conn => {
            return conn.find('UPDATE teacher SET account = ?,gender = ? WHERE name = ?',data)
        }).then(({conn})=>{
            return conn.commitPromise();
        })
    }
});

function remove_space(str) {
    return str.replace(/\s*/g, "");
}
