const mysql = require('./sql');


function SelectScheme(id, student_account) {
    let scheme_sql = 'SELECT selected FROM scheme WHERE id = ?';
    mysql.find(scheme_sql, student_account).then(SelectedList =>{
        console.log(SelectedList)
    })
}

SelectScheme(23, 15);