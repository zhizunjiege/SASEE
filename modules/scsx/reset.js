const { scripts } = global.config.files;
const path = require('path');
const file = require(`${scripts}/file`);

module.exports = async function () {
    let promises = [];
    for (const i of ['reports', 'tmp']) {
        promises.push(file.clrdir(path.resolve(__dirname, i)));
    }
    return Promise.allSettled(promises);
};