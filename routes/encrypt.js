const crypto = require('crypto');

exports.unsign = function(val, secret){
    if ('string' != typeof val) throw new TypeError("Signed cookie string must be provided.");
    if ('string' != typeof secret) throw new TypeError("Secret string must be provided.");
    //加密后的cookie是这种类型的：hello.DGDUkGlIkCzPz+C0B064FNgHdEjox7ch8tOBGslZ5QI
    var sha1 = crypto.createHash('sha1');
    var str = val.slice(0, val.lastIndexOf('.'))
        //获取最后一个点号前面的字符作为我们要解密的cookie的签名
        , mac = exports.sign(str, secret);
    //然后对传入的解密的val和刚才通过明文加密的结果进行对象，如果相同就是true，否则就是false
    return str;//sha1(mac) == sha1(val) ? str : false;
};
exports.sign = function(val, secret){
    if ('string' != typeof val) throw new TypeError("Cookie value must be provided as a string.");
    if ('string' != typeof secret) throw new TypeError("Secret string must be provided.");
    //最后加密过的字符串是中间包含一个点的字符串，是通过sha256来进行编码的
    return crypto
        .createHmac('sha256', secret)
        .update(val)
        .digest('base64')
        .replace(/\=+$/, '');
};