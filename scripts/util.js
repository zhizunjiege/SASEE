/* 与网络请求无关的工具函数 */
function paramValidate(param) {
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
            if (!paramValidate(param[i])) {
                return false;
            }
        }
    } else if (isObject(param)) {
        for (const key in param) {
            flag = paramValidate(param[key]);
        }
    } else {
        flag = _check(param);
    }
    return flag;
}
function pinValidate(pin, code) {
    if (!pin) return false;
    if (Date.now() - pin.time > 5 * 60 * 1000) {
        pin.code = '';
        pin.time = 0;
        return false;
    } else if (code !== pin.code) {
        return false;
    } else {
        return true;
    }
}
function dataFilter(data, fields) {
    for (const key of fields) {
        if (!data[key]) delete data[key];
    }
    return data;
}
function dataExtracter(from, to, fields) {
    for (const key of fields) {
        if (from[key]) {
            to[key] = from[key];
        }
    }
    return to;
}
function isObject(obj) {
    return Object.prototype.toString.call(obj) == '[object Object]';
}

module.exports = { paramValidate, pinValidate, dataFilter, dataExtracter, isObject };