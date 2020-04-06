import axios from '/frames/axios/axios.js'

class Branch {
    url = '';
    request = null;
    response = null;
    constructor(url = '', req = null, res = null) {
        this.url = url;
        this.request = req;
        this.response = res;
    }
};

class NetRouter {
    branches = {};
    constructor(config) { }
    analyse(url, ifCreate = false) {
        let nest = url.split('/');
        if (!nest.length) {
            return null;
        }
        if (!nest[0]) {
            nest.shift();
        }
        let last = nest.length - 1;
        if (!nest[last]) {
            nest.pop();
        } else {
            let index = nest[last].indexOf('?');
            if (index > 0) {
                nest[last] = nest[last].substring(0, index);
            }
        }
        let pointer = this.branches;
        for (const iterator of nest) {
            if (!pointer[iterator]) {
                if (ifCreate) {
                    pointer[iterator] = {};
                } else {
                    return null;
                }
            }
            pointer = pointer[iterator];
        }
    }
    use() { }
    route(url, req, res) {
        let pointer = this.analyse(url, true);
        if (pointer) {
            pointer.url = url;
            pointer.request = req;
            pointer.response = res;
        } else {
            throw new Error('非法URL！');
        }
    }
    emit(url, data) {
        let pointer = this.analyse(url, false);
        if (pointer) {
            if (pointer.request) {

            }
        } else {
            throw new Error('非法URL！');
        }
    }
    // getNetFunc() { }
};

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

export default NetRouter;