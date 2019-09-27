function notFound(req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 ！- Not Found 该页面未建立');
}
function logout(req, res) {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect('/');
    });
}
module.exports = { notFound, logout };