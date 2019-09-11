const nodemailer = require('nodemailer');

// to_addr = ['2945161896@qq.com']
function send(to_addr, content, subject= '选课系统') {
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
    transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('发送成功');
    });
}

module.exports = send;