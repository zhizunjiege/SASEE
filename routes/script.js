//一次更新全部时间
//单独设置某一个，提前结束或延后，更新所需执行的操作
//需要自动执行的脚本，通知，以及更新state
//立即开始
// 11 cols
const schedule = require("node-schedule");
const mysql = require('./sql');
const PERIODARRAY = [
    {period: "open", des: '系统开启'},
    {period: "submit", des: '提交课题'},
    {period: "review", des: '初次审核'},
    {period: "modify", des: '课题修改'},
    {period: "release", des: '二次审核'},
    {period: "choose", des: '学生选题'},
    {period: "draw", des: '系统抽签'},
    {period: "publicity", des: '数据公示'},
    {period: "final", des: '补选改选'},
    {period: "general", des: '选题完成'},
    {period: "close", des: '系统关闭'}
];

function start(req) {
    for (let i = 1; i < 10; i++) {
        schedule.scheduleJob(req.body[PERIODARRAY[i]], () => {
            //set state
            let set_state = 'UPDATE period SET state = ? where id = 1';
            mysql.find(set_state, i).then(success => {
                let date = new Date();
                console.log(date.toLocaleDateString(), date.getHours(), ':', date.getMinutes(), '修改状态为：', i);
            }, err => {
                console.log(err);
            })
        })
    }
    //update database
    let change_schedule = 'UPDATE period SET ? WHERE id = 1';
    mysql.find(change_schedule, req.body).then(success => {
        console.log('管理员修改时间为：', req.body);
    }, err => {
        console.log(err);
    })
}

function change_all(req) {
    // cancel all
    for (let i in schedule.scheduledJobs) {
            schedule.cancelJob(i.name)
    }
    start(req);
}
