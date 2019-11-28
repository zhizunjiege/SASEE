const [mysql, util] = superApp.requireUserModules(['mysql', 'util']);

function setGeneralInfo(fieldArray) {
    return (req, res) => {
        let param = {},
            { identity, account } = req.session,
            sql_update = 'UPDATE ?? SET ? WHERE account=?';
        for (let i = 0; i < fieldArray.length; i++) {
            const element = fieldArray[i];
            if (req.body[element]) {
                param[element] = req.body[element];
            }
        }
        if (util.paramIfValid(param)) {
            mysql.find(sql_update, [identity, param, account]).then(() => {
                res.send('已更新信息！');
            }).catch(util.catchError(res));
        } else {
            res.status(403).send('数据不合法，请改正后重试！');
        }
    }
};

function setEmailAddr(req, res) {
    let { pinCode, identity, account } = req.session,
        sql_update = 'UPDATE ?? SET email=? WHERE account=?';
    if (!pinCode || Date.now() - pinCode.time > 5 * 60 * 1000) {
        req.session.pinCode = null;
        res.status(403).send('验证码已失效，请重试！');
    } else if (req.body.pinCode == pinCode.code) {
        mysql.find(sql_update, [identity, req.body.email, account]).then(() => {
            res.send('已成功更新邮箱地址！');
        }).catch(util.catchError(res));;
    } else {
        res.status(403).send('验证码不匹配,请重试！');
    }
}

module.exports = { setGeneralInfo, setEmailAddr };