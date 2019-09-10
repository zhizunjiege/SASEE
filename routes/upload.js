const fs = require("fs");
function upload(req, res) {
    var file = req.file;
    // console.log("名称：%s",file.originalname);
    // console.log("mime：%s",file.mimetype);
//以下代码得到文件后缀
    let name = file.originalname;
    let nameArray = name.split('');
    let nameMime = [];
    let l = nameArray.pop();
    nameMime.unshift(l);
    while (nameArray.length != 0 && l != '.') {
        l = nameArray.pop();
        nameMime.unshift(l);
    }
//Mime是文件的后缀
    let Mime = nameMime.join('');
    console.log(Mime);
    res.send("done");
//重命名文件 加上文件后缀
    fs.renameSync('./upload/' + file.filename, './upload/' + file.originalname);
}
module.exports = upload;