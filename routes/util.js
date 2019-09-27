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
            flag = paramIfValid(param[i]);
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

module.exports = { paramIfValid, isObject };