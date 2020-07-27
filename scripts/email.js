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

function pinCodeTemp(code) {
    return `这是本次验证码：${code}。<br/>此验证码在五分钟内有效。<br/>${CONSTANT.FOOTER}`;
}

module.exports = { createSixNum, send, pinCodeTemp };