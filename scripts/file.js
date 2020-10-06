const fs = require('fs');
const path = require('path');

/* function rmdirSyncRecursive(p) {
    if (fs.existsSync(p)) {
        fs.readdirSync(p).forEach(function (file) {
            let curPath = path.resolve(p, file);
            if (fs.statSync(curPath).isDirectory()) {
                rmdirSyncRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(p);
    }
}*/

//fs模块的递归删除是实验性的，经常出错，所以自己写一个异步的
async function rmdir(p) {
    let files = await fs.promises.readdir(p);
    for (const file of files) {
        let curPath = path.resolve(p, file);
        let stat = await fs.promises.stat(curPath);
        if (stat.isDirectory()) {
            await rmdir(curPath);
        } else {
            await fs.promises.unlink(curPath);
        }
    }
    return fs.promises.rmdir(p);
}

async function clrdir(p) {
    if (fs.existsSync(p)) {
        await rmdir(p);
    }
    return fs.promises.mkdir(p);
}

async function move(from, to) {
    await fs.promises.mkdir(path.dirname(to), { recursive: true });
    return fs.promises.rename(from, to);
}

async function readJson(path) {
    let ret = await fs.promises.readFile(path, {
        encoding: 'utf8'
    });
    return JSON.parse(ret);
}

async function writeJson(path, data) {
    return fs.promises.writeFile(path, JSON.stringify(data), {
        encoding: 'utf8'
    });
}

module.exports = {
    exists: fs.existsSync,
    writeFile: fs.promises.writeFile,
    unlink: fs.promises.unlink,
    mkdir: fs.promises.mkdir,
    rmdir,
    clrdir,
    move,
    readJson,
    writeJson
};