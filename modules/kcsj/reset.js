const { scripts } = global.config.files;
const path = require('path');
const file = require(`${scripts}/file`);

module.exports = async function () {
    let time = { open: '', close: '', CHOOSEUSABLE: false };
    await file.writeJson(path.resolve(__dirname, 'time.json'), time);

    let promises = [];
    for (const i of ['backup']) {
        promises.push(file.clrdir(path.resolve(__dirname, i)));
    }
    return Promise.allSettled(promises);
};