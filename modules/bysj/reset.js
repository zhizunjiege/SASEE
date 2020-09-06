const { scripts } = global.config.files;
const path = require('path');
const file = require(`${scripts}/file`);

module.exports = async function () {
    let time = { open: '', close: '', draw: '', adjust: '', CHOOSEUSABLE: false };
    await file.writeJson(path.resolve(__dirname, 'config/time.json'), time);

    let promises = [];
    for (const i of ['backup', 'files', 'tmp']) {
        promises.push(file.clrdir(path.resolve(__dirname, i)));
    }
    return Promise.allSettled(promises);
};