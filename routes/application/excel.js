const superApp = require('../../config');//引用路径记得改对
const mysql = superApp.requireUserModule('mysql');
const nodeExcel = require('excel-export');
const fs = require('fs');

function excel_exe(keyword, name, table) {
    let conf = {};
    conf.cols = [{
        caption: name[0],
        captionStyleIndex: 1,
        type: 'string',
        width: 30
    }];
    for (let i = 1; i < keyword.length; i++) {
        conf.cols.push({
            caption: name[i],
            type: 'string',
            width: 30
        })
    }
    let find_sql = 'SELECT ' + keyword.toString() + ' FROM ' + table.toString();
    return mysql.find(find_sql, []).then(res => {
        let data = [];
        for (let i = 0; i < res.length; i++) {
            let row = [];
            for (let n = 0; n < keyword.length; n++) {
                let word = res[i][keyword[n]];
                word = word == null ? ' ' : word.toString();
                row.push(word)
            }
            data.push(row);
        }
        conf.rows = data;
        console.log(conf.rows);
        console.log(conf.cols);
        return nodeExcel.execute(conf);
    })
}

module.exports = excel_exe;
// let info = ['account', 'bysj'];
// let name = ['学号','所选课题'];
// excel_exe(info, name,'student').then(result => {
//     fs.writeFileSync("./1.xlsx", result, 'binary');
// });
