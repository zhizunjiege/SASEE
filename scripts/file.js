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
}
async function rmdir(p) {
    if (fs.existsSync(p)) {
        let files = await fs.promises.readdir(p);
        files.forEach(async function (file) {
            let curPath = path.resolve(p, file);
            let stat = await fs.promises.stat(curPath);
            if (stat.isDirectory()) {
                await rmdir(curPath);
            } else {
                await fs.promises.unlink(curPath);
            }
        });
        return fs.promises.rmdir(p);
    }
} */

async function clrdir(p) {
    await fs.promises.rmdir(p, { recursive: true });
    return fs.promises.mkdir(p);
}

async function move(from, to) {
    await fs.promises.mkdir(path.dirname(to), { recursive: true });
    return fs.promises.rename(from, to);
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
    rmdir: fs.promises.rmdir,
    clrdir,
    move,
    writeJson
};