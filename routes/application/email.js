const nodemailer = require('nodemailer'),
    [mysql, util] = superApp.requireUserModules(['mysql', 'util']);

const CONSTANT = {
    SYS_TEST: '此邮件为系统测试邮件，请忽略······',
    SYS_FOOTER: `<footer style="text-align:center;position:absolute;bottom:0;">~~~此邮件由系统代发,请勿回复~~~</footer>`,
    SYS_SUBJECT: '毕业设计系统通知'
}

function _createSixNum() {
    let Num = "";
    for (let i = 0; i < 6; i++) {
        Num += Math.floor(Math.random() * 10);
    }
    return Num;
}

function _send({ from = 'sasee_lab@163.com', password = '880424d', to, text = '', html = CONSTANT.SYS_TEST, subject = CONSTANT.SYS_SUBJECT } = {}) {
    try {
        const transporter = nodemailer.createTransport({
            service: '163',
            auth: {
                user: from,
                pass: password
            }
        });
        return transporter.sendMail({ from, to, text, html, subject });
    } catch{
        console.log('邮箱登陆失败！');
    }
}

function _spcmw(req, res, next) {
    let { identity, account } = req.query,
        sql_query = 'SELECT email FROM ?? WHERE account=?';
    mysql.find(sql_query, [identity, account]).then(results => {
        req.query.email = results[0].email;
        next();
    }).catch(util.catchError(res));
}

function sendPinCode(req, res) {
    let pinCode = _createSixNum(),
        email = req.query.email;
    _send({
        to: email,
        html: '这是本次验证码：' + pinCode + '。此验证码在五分钟内有效。',
        subject: '邮箱验证'
    }).then(info => {
        req.session.pinCode = {
            code: pinCode,
            time: new Date().getTime()
        };
        res.send('验证码已发送至' + email.replace(/(\S{2,})(\S{4,4})(@.*)/, '$1****$3'));
    }).catch(util.catchError(res));
}

function sendEmail(req, res) {
    let { toAddr, title, content, extraData } = req.body;
    _send({
        to: toAddr,
        html: (extraData || '') + content + CONSTANT.SYS_FOOTER,
        subject: title
    }).then(info => {
        res.send('邮件发送成功！');
    }).catch(util.catchError(res));
}

function emailTemplate({ title = '通知', paragraph = [], from = '系统' } = {}) {
    let p = ``;
    for (let i = 0; i < paragraph.length; i++) {
        p += `<p>${paragraph[i]}</p>`;
    }
    return `
        <h3>${title}</h3>
        ${p}
        <p>${from}</p>
        <p>${new Date().toLocaleString()}</p>
            `;
}

module.exports = { CONSTANT, _spcmw, _send, sendPinCode, sendEmail, emailTemplate };