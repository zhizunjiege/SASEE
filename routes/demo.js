var action = require("./action")

//var an;
//action.get_new("../json/notice.json",3) .then((data) => {an = data;console.log(an)}).catch(console.error);


var mysql = require("./sql")
var sql = "SELECT * FROM notice order by id DESC limit ?"
var num = 3
mysql.query(sql,num,function (err, data) {
    if(err)console.log(err);
    data = JSON.parse(JSON.stringify(data))
    console.log(data)

    var arr = new Array(num)
    for (var i=0;i<num;i++) {
    delete data[i].id;
    arr[i] = data[i]
    }
    console.log(arr)
})

