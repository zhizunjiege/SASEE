const nodemailer = require('nodemailer');
const mysql = require('./sql');

// to_addr = ['2945161896@qq.com']
function send(to_addr, content, subject = '选课系统') {
    const transporter = nodemailer.createTransport({
        service: '163',
        auth: {
            user: 'sasee_lab@163.com',
            pass: '880424d'
        }
    });
    const mailOptions = {
        from: 'sasee_lab@163.com', // 发送者
        to: to_addr,
        subject: subject,
        text: content,
        html: '',
        attachments: []
    };
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('发送成功');
    });
}

function sendPinCode(req, res) {
    let to_addr = req.query.email,
        pinCode = _createSixNum(),
        content = '这是本次验证码：' + pinCode + '。此验证码在五分钟内有效。';
    send(to_addr, content, '邮箱验证');

    req.session.pinCode = pinCode;
    res.send('验证码已发送！');
}

function setEmailAddr(req, res) {
    let pinCode = req.session.pinCode,
        identity = req.session.identity,
        account = req.session.account,
        sql_update = 'UPDATE ?? SET email=? WHERE account=?';

    if (!pinCode) {
        console.log(req.session);
        
        res.status(403).send('验证码已失效，请重试！');
    } else if (req.body.pin_code == pinCode) {
        mysql.find(sql_update,[identity,req.body.email,account]).then(()=>{
            res.status(200).send('已成功更新邮箱地址！');
        });
    } else {
        console.log(req.session);
        
        res.status(403).send('验证码不匹配,请重试！');
    }
}

function _createSixNum() {
    let Num = "";
    for (let i = 0; i < 6; i++) {
        Num += Math.floor(Math.random() * 10);
    }
    return Num;
}

module.exports = { send, sendPinCode, setEmailAddr };