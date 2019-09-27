const mysql = require('./sql');
const { paramIfValid } = require('./util');

module.exports = (fieldArray) => {
    return (req, res) => {
        console.log(req.body);
        let param = {},
            { identity, account } = req.session,
            sql_update = 'UPDATE ?? SET ? WHERE account=?';
        for (let i = 0; i < fieldArray.length; i++) {
            const element = fieldArray[i];
            if (req.body[element]) {
                param[element] = req.body[element];
            }
        }
        if (paramIfValid(param)) {
            mysql.find(sql_update, [identity, param, account]).then(() => {
                res.send('已更新信息！');
            }, (err) => {
                res.status(403).send('更新信息出错，请稍后重试！');
            });
        } else {
            res.status(403).send('数据不合法，请改正后重试！');
        }
    }
};