const superApp = require('../../config');//引用路径记得改对
const mysql = superApp.requireUserModule('mysql');
const nodeExcel = require('excel-export');
const fs = require('fs');

function excel_exe(query) {
    let conf_all = [];
    let find_sql = '';
    for (let n = 0; n < query.length; n++) {
        let keyword = [];
        keyword.push(query[n]['keyword'][0]);
        let conf = {};
        conf.cols = [{
            caption: query[n]['name'][0],
            //captionStyleIndex: 1,
            type: 'string',
            width: 30
        }];
        for (let i = 1; i < query[n]['keyword'].length; i++) {
            keyword.push(query[n]['keyword'][i].toString()=='group'?'`group`':query[n]['keyword'][i].toString());
            conf.cols.push({
                caption: query[n]['name'][i],
                type: 'string',
                width: 30
            });
        }
        find_sql += 'SELECT ' + keyword + ' FROM ' + query[n]['table'].toString() + ';';
        conf_all.push(conf);
    }
    return mysql.find(find_sql, []).then(res => {
        for (let n = 0; n < res.length; n++) {
            let data = [];
            for (let i = 0; i < res[n].length; i++) {
                let row = [];
                for (let m = 0; m < query[n]['keyword'].length; m++) {
                    let word = res[n][i][query[n]['keyword'][m]];
                    word = word == null ? ' ' : word.toString();
                    row.push(word)
                }
                data.push(row);
            }
            conf_all[n].rows = data;
        }
        return nodeExcel.execute(conf_all);
    })
}

module.exports = excel_exe;

//注意，我在内部加了判断，如果需要'group'字段，关键字直接输'group'即可，不需要'`group`'

// let info = ['account', 'bysj'];
// let name = ['学号', '所选课题'];
// let query = [{keyword: info, name: name, table: 'student'}];
// query.push({keyword: ['id', 'group', 'student'], name: ['id', '分组', '学生'], table: 'bysj'});
// excel_exe(query).then(result => {
//     fs.writeFileSync("./1.xlsx", result, 'binary');
// });