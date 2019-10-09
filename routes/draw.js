const mysql = require('./sql');

function _draw(selected, capacity) {
    let len = selected.length;
    if (len > capacity) {
        for (let i = 0; i < len - capacity; i++) {
            selected.splice(Math.floor(Math.random() * selected.len), 1);
        }
    }
    return selected;
}