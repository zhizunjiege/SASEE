const _net = {
    system: {
        get: {}, post: {}, local: {}
    }
};
let _pre = null;

function pre(func) {
    if (func) {
        _pre = func;
    }
    return _pre;
}

function use(namespace, method, path, callback) {
    if (!Array.isArray(_net[namespace][method][path])) {
        _net[namespace][method][path] = [];
    }
    if (Array.isArray(callback)) {
        _net[namespace][method][path] = [..._net[namespace][method][path], ...callback];
    } else {
        _net[namespace][method][path].push(callback);
    }
}

function load(module, routes) {
    let _ = _net[module];
    if (!_) {
        _ = _net[module] = { get: {}, post: {}, local: {} };
    }
    for (const iterator of routes) {
        _[iterator.method][iterator.path] = Array.isArray(iterator.callback) ? iterator.callback : [iterator.callback];
    }
}

function get(path, ...callback) {
    use('system', 'get', path, callback);
}

function post(path, ...callback) {
    use('system', 'post', path, callback);
}

function local(path, ...callback) {
    use('system', 'local', path, callback);
}

async function net(method, path, data) {
    let result = data, _callbacks = _net[this.$module][method][path];
    if (Array.isArray(_callbacks)) {
        for (const iterator of _callbacks) {
            try {
                result = await iterator.bind(this)(result);
            } catch (err) {
                result = err;
                break;
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
    net, pre, use, get, post, local, load
}