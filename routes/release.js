const mysql = require("./sql");
const SendMail = require('./SendMail');
//根据 新建、修改的不同，表单有差距，新建的话，没有id这一属性
function change(account, category, content) {
    let generated = [];
    let IsNew = false;
    let max_id = "SELECT id FROM scheme where account = ? order by id DESC";
    mysql.find(max_id, account).then(scheme_data => {
        if (scheme_data.length === 0) IsNew = true;
        generated = category.toString() + account.toString() + ((scheme_data.length === 0) ? '01' : (scheme_data[0].id + 1).toString());
        console.log(generated);
    }, err => {
        console.log(err);
    }).then(() => {
        let new_scheme = 'INSERT INTO scheme SET ?';
        if (IsNew)
            content = {
                id: generated,
                capacity: 10,
                category: 1
            };
        else content = {};
        mysql.find(new_scheme, content);
    })
}

function display_teacher(account) {
    let my_scheme = 'select * from scheme where account = ?';
    mysql.find(my_scheme, account).then(my_list => {
        console.log(my_list);
    });
}

function display_admin(category) {
    let my_sub_scheme = "SELECT * FROM scheme WHERE category = ?"
    mysql.find(my_sub_scheme, category).then(sub => {
        console.log(sub);
    })
}

function delete_scheme(id) {
    let delete_sql = 'DELETE FROM scheme WHERE id = ?';
    mysql.find(delete_sql, id).then(success => {
        console.log('success');
    }, err => {
        console.log(err);
    })

}

//增加驳回的理由
function beat(id) {
    let title, account, mail;
    let failed_sql = 'UPDATE scheme SET IsPassed = 0 WHERE id = ?';
    let get_scheme_info = 'SELECT account,title FROM scheme WHERE id = ?';
    let get_teacher = 'SELECT email FROM teacher WHERE account = ?';
    mysql.find(failed_sql, id).then(success => {
        return mysql.find(get_scheme_info, id)
    }).then(scheme_info => {
        console.log(scheme_info);
        account = scheme_info[0].account;
        title = scheme_info[0].title;
        return mysql.find(get_teacher, account)
    }).then(teacher_info => {
        mail = teacher_info[0].email;
        let context = '您提交的课程："' + title + '"很遗憾未通过审核，请修改后重新提交';
        console.log(mail);
        console.log(context);
        SendMail(mail, context, '新的主题');
    })
}

//generate(17375272, 1);

beat(666666);