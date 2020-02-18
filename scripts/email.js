const nodemailer = require('nodemailer');

const CONSTANT = {
    TEST: '此邮件为系统测试邮件，请忽略······',
    FOOTER: `<footer style="text-align:center;position:absolute;bottom:0;">~~~此邮件由系统代发,请勿回复~~~</footer>`,
    SUBJECT: '毕业设计系统通知'
}

function createSixNum() {
    let Num = "";
    for (let i = 0; i < 6; i++) {
        Num += Math.floor(Math.random() * 10);
    }
    return Num;
}

function send({ from = 'benke03@buaa.edu.cn', password = 'zXYnJxAqvHfNdE3c', to, text = '', html = CONSTANT.TEST, subject = CONSTANT.SUBJECT } = {}) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.buaa.edu.cn',
        port: 25,
        secure: false,
        auth: {
            user: from,
            pass: password
        },
        tls: { rejectUnauthorized: false }
    });
    if (to.length) {
        return transporter.sendMail({ from, to, text, html, subject });
    } else {
        throw 1101;
    }
}

/* function sendEmail(req, res) {
    let { toAddr, title, content, extraData } = req.body;
    _send({
        to: toAddr,
        html: (extraData || '') + content + CONSTANT.FOOTER,
        subject: title
    }).then(info => {
        res.send('邮件发送成功！');
    }).catch(util.catchError(res, superApp.errorMap));
} */
function pinCodeTemp(code) {
    return `这是本次验证码：${code}。<br/>此验证码在五分钟内有效。<br/>${CONSTANT.FOOTER}`;
}
function emailTemp({ title = '通知', paragraph = [] } = {}) {
    let p = ``;
    for (let i = 0; i < paragraph.length; i++) {
        p += `<p>${paragraph[i]}</p>`;
    }
    return `
        <h3 style="text-align:center;">${title}</h3>
        ${p}
        <p style="text-align:center;">系统时间：${new Date().toLocaleString()}</p>
            ${CONSTANT.FOOTER}`;
}

module.exports = { createSixNum, send, pinCodeTemp, emailTemp };