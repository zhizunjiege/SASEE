const fs = require('fs');

function move(from, to, callback) {
    _mkdir(to);
    fs.rename(from, to, callback);
}

function _mkdir(filepath) {
    const dirCache = {};
    const arr = filepath.split('/');
    let dir = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (!dirCache[dir] && !fs.existsSync(dir)) {
            dirCache[dir] = true;
            fs.mkdirSync(dir);
        }
        dir = dir + '/' + arr[i];
    }
}

function deleteAll(path, rmDir = true) {
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
};

module.exports = { move, deleteAll };