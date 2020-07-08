const fs = require('fs');
const path = require('path');

//读写json文件
function readJson(path) {
    return JSON.parse(fs.readFileSync(path, {
        encoding: 'utf8'
    }));
}
function writeJson(path, data) {
    fs.writeFileSync(path, JSON.stringify(data), {
        encoding: 'utf8'
    });
}
//移动
function move(from, to, callback) {
    _mkdir(to);
    fs.rename(from, to, callback);
}
//递归创建目录
function _mkdir(filepath) {
    const dirCache = {};
    const arr = filepath.split(path.sep);
    let dir = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (!dirCache[dir] && !fs.existsSync(dir)) {
            dirCache[dir] = true;
            fs.mkdirSync(dir);
        }
        dir = dir + path.sep + arr[i];
    }
}
//删除全部
/* function deleteAll(path, rmDir = true) {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                deleteall(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        if (rmDir) {
            fs.rmdirSync(path);
        }
    }
}; */

module.exports = { readJson, writeJson, move, writeFile: fs.promises.writeFile, unlink: fs.promises.unlink };