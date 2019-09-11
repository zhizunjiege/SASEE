const mysql = require("./sql");

//根据 新建、修改的不同，表单有差距，新建的话，没有id这一属性
function generate(account, category, content) {
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
        else content = {

        };
        mysql.find(new_scheme, content);
    })
}

function display_teacher(account){
    let my_scheme = 'select * from scheme where account = ?';
    mysql.find(my_scheme, account).then(my_list =>{
        console.log(my_list);
    });
}

function display_admin(category) {
    let my_sub_scheme = "SELECT * FROM scheme WHERE category = ?"
    mysql.find(my_sub_scheme, category).then(sub =>{
        console.log(sub);
    })
}

function delete_scheme(id){
    let delete_sql = 'DELETE FROM scheme WHERE id = ?';
    mysql.find(delete_sql, id).then(success =>{
        console.log('success');
    },err =>{
        console.log(err);
    })

}
//generate(17375272, 1);