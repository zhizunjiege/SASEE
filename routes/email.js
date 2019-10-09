const nodemailer = require('nodemailer'), mysql = require('./sql');

function _createSixNum() {
    let Num = "";
    for (let i = 0; i < 6; i++) {
        Num += Math.floor(Math.random() * 10);
    }
    return Num;
}

function _send({ from = 'sasee_lab@163.com', password = '880424d', to, text = '', html, subject = '毕业设计选题系统' } = {}) {
    const transporter = nodemailer.createTransport({
        service: '163',
        auth: {
            user: from,
            pass: password
        }
    });
    return transporter.sendMail({ from, to, text, html, subject });
}

function _spcmw(req, res, next) {
    let { identity, account } = req.query,
        sql_query = 'SELECT email FROM ?? WHERE account=?';
    mysql.find(sql_query, [identity, account]).then(results => {
        req.query.email = results[0].email;
        next();
    }).catch(err => {
        console.log(err);
        res.status(403).send('验证码发送失败，请稍后重试！');
    });
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
    }).catch(err => {
        console.log(err);
        res.status(403).send('验证码发送失败，请稍后重试！');
    });
}

function sendEmail(req, res) {
    let { toAddr, title, content, extraData } = req.body;
    _send({
        to: toAddr,
        html: (extraData || '') + content + `<footer style="text-align:center">~~~此邮件由系统代发,请勿回复~~~</footer>`,
        subject: title
    }).then(info => {
        res.send('邮件发送成功！');
    }).catch(err => {
        console.log(err);
        res.status(403).send('邮件发送失败，请稍后重试！');
    });
}

module.exports = { _spcmw, sendPinCode, sendEmail };