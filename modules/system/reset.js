const path = require('path');
const file = require('../../scripts/file');
const mysql = require('../../scripts/mysql');

module.exports = async function () {
    let sql = 'SET FOREIGN_KEY_CHECKS=0;TRUNCATE news;TRUNCATE student;TRUNCATE teacher;TRUNCATE bysj;TRUNCATE kcsj;TRUNCATE scsx;TRUNCATE scsx_task;TRUNCATE scsx_report;SET FOREIGN_KEY_CHECKS=1';
    await mysql.find(sql);

    let backup = path.resolve(__dirname, 'backup.sql');
    if (file.exists(backup)) {
        await file.unlink(backup);
    }

    let promises = [];
    for (const i of ['resources/html/news', 'tmp']) {
        promises.push(file.clrdir(path.resolve(__dirname, i)));
    }
    return Promise.allSettled(promises);
};