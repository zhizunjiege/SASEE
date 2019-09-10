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
    //判断并建立文件夹
    let my_path = './upload/new/';
    mkdir(my_path);
//重命名文件 加上文件后缀
    //fs.renameSync('./upload/' + file.filename, './upload/' + file.originalname);
    let readableStream = fs.createReadStream('./upload/' + file.filename);
    let writeableStream = fs.createWriteStream(my_path + file.originalname);
// 可以通过使用可读流的函数pipe()接入到可写流中
// pipe()是一种很高效的数据处理方式
    if (readableStream.pipe(writeableStream)) {
        fs.unlinkSync('./upload/' + file.filename);
        console.log('文件复制成功了')
    } else {
        console.log('文件复制失败了')
    }
}

function mkdir(filepath) {
    const dirCache={};
    const arr=filepath.split('/');
    let dir=arr[0];
    for(let i=1;i<arr.length;i++){
        if(!dirCache[dir]&&!fs.existsSync(dir)){
            dirCache[dir]=true;
            fs.mkdirSync(dir);
        }
        dir=dir+'/'+arr[i];
    }
}

function deleteall(path) {
    var files = [];
    if(fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function(file, index) {
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteall(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

module.exports = upload;