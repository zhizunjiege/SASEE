const [mysql, email, draw] = superApp.requireUserModules(['mysql', 'email', 'draw']);

function queryEmailAddrToArray({ sql, identity, then } = {}) {
    let sql_query = sql || 'SELECT email FROM ??' + (Array.isArray(identity) ? ' UNION SELECT email FROM ??'.repeat(identity.length - 1) : '');
    return mysql.find(sql_query, identity).then(results => {
        let addr = [];
        for (let i = 0; i < results.length; i++) {
            addr.push(results[i].email);
        }
        if (addr.length > 0) {
            then(addr);
        }
    });
}

function queryNumberToTables({ sql, captionArray, then } = {}) {
    return mysql.find(sql).then(results => {
        let paragraph = [];
        if (captionArray.length > 1) {
            for (let i = 0; i < results.length; i++) {
                if (results[i].length > 0) {
                    paragraph.push(email.tableTemplate({ caption: captionArray[i], tableItems: results[i] }));
                }
            }
        } else {
            paragraph.push(email.tableTemplate({ caption: captionArray[0], tableItems: results }));
        }
        if (paragraph.length > 0) {
            then(paragraph);
        }
    });
}

function sendEmail({ sql, identity = 'admin', title, paragraph }) {
    queryEmailAddrToArray({
        sql,
        identity,
        then: addr => {
            email._send({
                to: addr,
                html: email.emailTemplate({ title, paragraph })
            });
        }
    });
}

function sendInfoToAdmin({ sql, title, captionArray = ['学生', '教师', '系主任'] } = {}) {
    queryNumberToTables({
        sql,
        captionArray,
        then: paragraph => {
            sendEmail({
                html: {
                    title,
                    paragraph
                }
            });
        }
    });
}

function deleteSubject() {
    let sql_delete = "DELETE FROM bysj WHERE state='2-未通过'";
    mysql.find(sql_delete).then(info => {
        console.log(info);
        console.log(`废弃课题已全部删除！共删除了${info.affectedRows}个课题。`);
    });
}

function drawAll(succeed, fail) {
    draw().then(() => {
        sendEmail(succeed);
    }).catch(err => {
        console.log(err);
        sendEmail(fail);
    });
}

function closeServer(param) {
    sendEmail(param);
    superApp.server.close();
}

module.exports = { sendEmail, sendInfoToAdmin, deleteSubject, drawAll, closeServer };