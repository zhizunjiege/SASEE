function paramIfValid(param) {
    function _check(value) {
        if (!value) {
            const type = typeof value;
            if (type != 'number' && type != 'bigint' && type != 'boolean') {
                return false;
            }
        }
        return true;
    }

    let flag = true;
    if (Array.isArray(param)) {
        for (let i = 0; i < param.length; i++) {
            if (!paramIfValid(param[i])) {
                return false;
            }
        }
    } else if (isObject(param)) {
        for (const key in param) {
            flag = paramIfValid(param[key]);
        }
    } else {
        flag = _check(param);
    }
    return flag;
}

function isObject(obj) {
    return Object.prototype.toString.call(obj) == '[object Object]';
}

function catchError(res, errCodeMap) {
    return err => {
        let msg = '服务器出现错误，请稍后重试！';
        if (err instanceof Error) {
            console.log(err);
        } else if (isObject(errCodeMap)) {
            for (const [errCode, errMsg] of Object.entries(errCodeMap)) {
                if (err == errCode) {
                    msg = errMsg;
                    break;
                }
            }
        }
        console.log(msg);
        res && res.status(403).send(msg);
        return;
    }
}

module.exports = { paramIfValid, isObject, catchError };