function n(req,res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 ！- Not Found 该页面未建立');
}
module.exports = n;