function up(req, res) {
    console.log(req);
    //console.log(req.body);
    var data = '';
    req.on('data', (buf) => {
        data += buf;
    });
    req.on('end', () => {
        console.log(data);

    });
}
module.exports = up