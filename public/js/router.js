const _net = {
    get: {}, post: {}, local: {}
}

function _use(method, path, callback) {
    if (!Array.isArray(_net[method][path])) {
        _net[method][path] = [];
    }
    if (Array.isArray(callback)) {
        _net[method][path] = [..._net[method][path], ...callback];
    } else {
        _net[method][path].push(callback);
    }
}

function get(path, ...callback) {
    _use('get', path, callback);
}

function post(path, ...callback) {
    _use('post', path, callback);
}

function local(path, ...callback) {
    _use('local', path, callback);
}

async function net(method, path, data) {
    let result = data, _callbacks = _net[method][path];
    if (Array.isArray(_callbacks)) {
        for (const iterator of _callbacks) {
            try {
                result = await iterator.bind(this)(result);
            } catch (err) {
                result = err;
            }
        }
        console.log(`${method}:${path} 路由成功！返回：`);
        console.log(result);
        return result;
    } else {
        console.log(`${method}:${path} 没有对应路由！`);
    }
}

export default {
    net, get, post, local
}