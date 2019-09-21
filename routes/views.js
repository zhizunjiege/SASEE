const mysql = require("./sql");

function _render(res, sql_query, param, file) {
    if (sql_query) {
        mysql.find(sql_query, param).then(data => {
            console.log(data);
            res.render(file, {data});
        });
    } else if (file) {
        res.render(file, {});
    } else {
        res.end();
        console.log('页面渲染出错！');
    }
}

function student(req, res) {
    let file = req.query.type,
        nextPageOffset = ((Number(req.query.nextPage) || 1) - 1) * 10,
        account = Number(req.session.account) || 0,
        direction = Number(req.session.direction) || 0,
        id = Number(req.query.id) || 0,
        sql_query = '',
        param;
    switch (file) {
        case 'newsList':
            //req.query.nextPage表示第几页
            sql_query = 'SELECT * FROM news ORDER BY top DESC,id DESC LIMIT 10 OFFSET ?';
            param = nextPageOffset;
            file = process.cwd() + '/resourses/common/views/newsList';
            console.log(param);
            break;
        case 'newsContent':
            file=process.cwd() + '/resourses/common/news/news_'+id;
            break;
        case 'userInfo':
            sql_query = 'SELECT * FROM student WHERE account =?';
            param = account;
            break;
        case 'subject':
        case 'subjectList':
            sql_query = 'SELECT bysj.id,title,`group`,chosen,capacity,submitTime,t.name teacher FROM bysj,teacher t WHERE `group`=? AND bysj.teacher=t.id ORDER BY lastModifiedTime DESC LIMIT 10 OFFSET ?';
            param = [direction, nextPageOffset];
            break;
        case 'subjectContent':
            sql_query = 'SELECT bysj.*,JSON_OBJECT("name",t.name,"gender",t.gender,"proTitle",t.proTitle,"field",t.field,"email",t.email,"department",t.department) teacher FROM bysj,teacher t WHERE bysj.id=? AND bysj.teacher=t.id';
            param = id;
            break;
        case 'mySubject':
            sql_query = 'SELECT notice,assignment,teacherFiles,studentFiles,JSON_OBJECT("profile",t.`profile`,"name",t.`name`,"gender",t.gender,"proTitle",t.proTitle,"department_des",t.department_des,"field",t.field,"office",t.office,"email",t.email,"tele",t.tele,"resume",t.resume) teacher FROM student stu,bysj,teacher t WHERE stu.account=? AND stu.bysj=bysj.id AND bysj.teacher=t.id';
            param = account;
            break;
        default: break;
    }
    _render(res, sql_query, param, file);
}

function teacher(req, res) {
    let file = req.query.type;
    let nextPageOffset = ((Number(req.query.nextPage) || 1) - 1) * 10;
    let account = Number(req.session.account) || 0;
    let direction = Number(req.session.direction) || 0;
    let id = Number(req.query.id) || 0;
    let sql_query = '';
    let param;
    switch (file) {
        case 'newsList':
            //req.query.nextPage表示第几页
            sql_query = 'SELECT * FROM news ORDER BY top DESC,id DESC LIMIT 10 OFFSET ?';
            param = nextPageOffset;
            file = process.cwd() + '/resourses/common/views/newsList';
            console.log(param);
            break;
        case 'newsContent':
            file=process.cwd() + '/resourses/common/news/news_'+id;
            break;
        case 'userInfo':
            sql_query = 'SELECT * FROM teacher WHERE account =?';
            param = account;
            break;
        case 'subject':
            sql_query = 'SELECT title,chosen,capacity,introduction,submitTime,lastModifiedTime FROM bysj,teacher t WHERE account=? AND bysj.id IN (t.bysj1,t.bysj2,t.bysj3)';
            param = account;
            break;
        case 'mySubject':
            sql_query = 'SELECT notice,teacherFiles,studentFiles,JSON_OBJECT("profile",t.`profile`,"name",t.`name`,"gender",t.gender,"proTitle",t.proTitle,"department",t.department,"field",t.field,"office",t.office,"email",t.email,"tele",t.tele,"resume",t.resume) teacher FROM student stu,bysj,teacher t WHERE stu.account=? AND stu.bysj=bysj.id AND bysj.teacher=t.id';
            param = account;
            break;
        default: break;
    }
    _render(res, sql_query, param, file);
}

function dean(req, res) {

}

function admin(req, res) {

}

function view(req, res) {
    switch (req.query.file) {
        case 'newsContent':
            //req.query.num表示第几条通知
            console.log(req.query.num);
            break;
        case 'newsList':
            //req.query.nextPage表示第几页
            res.render('newsList', {
                news: {
                    num: 53,
                    contents: (new Array(8)).fill({
                        top: true,
                        title: '系统开通',
                        publisher: '管理员',
                        category: '毕业设计',
                        date: '2019/07/13'
                    })
                }
            });
            console.log(req.query.nextPage);
            break;
        case 'userInfo':
            let find_teacher = "SELECT * FROM teacher WHERE account = ?"
            mysql.find(find_teacher, 1).then(
                teacher_info => {
                    res.render('teacher/userInfo', teacher_info[0])

                    //{account: 34442525,
                    // profile: 'cai.jpg',
                    // name: '某某某',
                    // gender: '女',
                    // proTitle: '讲师',
                    // direction: 301,
                    // field: '超电磁炮',
                    // office: '新主楼F-407',
                    // email: '88888888@buaa.edu.cn',
                    // tele: '166-6666-6666',
                    // resume: '我是练习时长两年的练习生，我喜欢唱、跳、coding和学习。'});
                }
            );

            break;
        case 'submitSubject':
            res.render('teacher/submitSubject', {
                ability: true
            });
            break;
        case 'subject':
            res.render('student/subject', {
                num: 23,
                contents: (new Array(14)).fill({
                    title: '做个什么呢我也不太清楚总之先取个长标题吧',
                    introduction: '反正就是简要介绍一下这个项目我把这段为你在大撒上了飞机的副书记绿色空间访客数量的v将来肯定v你',
                    direction: '301',
                    chosen: 3,
                    capacity: 7,
                    publisher: '某老师',
                    date: '2019/07/16'
                })
            });
            break;
        case 'subjectList':
            res.render('student/subjectList', {
                contents: (new Array(5)).fill({
                    title: '我也不知道要做什么',
                    direction: '302',
                    chosen: 5,
                    capacity: 7,
                    publisher: '某某老师',
                    date: '2019/07/16'
                })
            });
            break;
        case 'subjectContent':
            res.render('dean/subjectContent', {
                subject: {
                    number: 3,
                    title: '基于那啥做那啥',
                    direction: 307,
                    capacity: 5,
                    chosen: 3,
                    introduction: '<div><h3 style="text-align: center;">关于毕业设计选题系统开放的通知<span style="text-decoration-line: line-through;">​</span></h3><div><span style="text-decoration-line: line-through;">致3系全体师生：</span>​</div></div>',
                    materials: [
                        {
                            filename: '就那啥做那啥的文件.html',
                            url: '/doc/notice.html'
                        }
                    ],
                    submitTime: '2019/07/08',
                    lastModifiedTime: '2019/07/16'
                },
                teacher: {
                    name: '某某某',
                    gender: '女',
                    proTitle: '讲师',
                    direction: 307,
                    field: '超电磁炮',
                    email: '88888888@buaa.edu.cn'
                }
            });
            break;
        case 'mySubject':
            res.render('student/mySubject', {
                notice: new Array(5).fill({
                    top: true,
                    title: '准备开始开发了啊',
                    date: '2019/07/09',
                    content: '准备开始完成任务'
                }),
                assignment: [
                    {
                        title: '初步探讨',
                        deadline: '2019/11/13-12:00',
                        description: '本次任务的目的是完成初步的探讨····',
                        member: [{
                            name: '小红',
                            status: 0,
                            score: 98
                        }, {
                            name: '小明',
                            status: 0,
                            score: 100
                        }, {
                            name: '小刚',
                            status: 0,
                            score: 93
                        }]
                    }, {
                        title: '设计初稿',
                        deadline: '2019/11/23-08:00',
                        description: '本次任务的目的是进行进一步的设计，并提交设计初稿····',
                        member: [{
                            name: '小红',
                            status: 2,
                            score: 38
                        }, {
                            name: '小明',
                            status: 2,
                            score: 40
                        }, {
                            name: '小刚',
                            status: 2,
                            score: 53
                        }]
                    }, {
                        title: '最终成品',
                        deadline: '2019/12/03-00:00',
                        description: '本次任务的目的是完成最后的组装，形成最终成品····',
                        member: [{
                            name: '小红',
                            status: 1,
                            score: undefined
                        }, {
                            name: '小明',
                            status: 1,
                            score: undefined
                        }, {
                            name: '小刚',
                            status: 1,
                            score: undefined
                        }]
                    }
                ],
                teacher: {
                    profile: 'cai.jpg',
                    name: '某某某',
                    gender: '女',
                    proTitle: '讲师',
                    direction: 301,
                    field: '超电磁炮',
                    office: '新主楼F-407',
                    email: '88888888@buaa.edu.cn',
                    tele: '166-6666-6666',
                    resume: '我是练习时长两年的练习生，我喜欢唱、跳、coding和学习。'
                },
                student: (new Array(3)).fill({
                    email: '7983479832@qq.com',
                    status: {
                        specialty: '自动化',
                        direction: '模式识别',
                        class: '170326',
                        stuNum: '17375433',
                        name: '陈智杰',
                        gender: '男'
                    },
                    academic: {
                        gpa: 3.77,
                        weightAver: 91,
                        average: 89
                    }
                }),
                downFiles: [
                    {
                        date: '2019/11/20',
                        file: [
                            {
                                name: '可下载文件003.doc',
                                url: '/doc/notice.html',
                                uploader: '小红'
                            }, {
                                name: '可下载文件004.doc',
                                url: '/doc/notice.html',
                                uploader: '小明'
                            }
                        ]
                    }, {
                        date: '2019/10/24',
                        file: [
                            {
                                name: '可下载文件001.doc',
                                url: '/doc/notice.html',
                                uploader: '小明'
                            }, {
                                name: '可下载文件002.doc',
                                url: '/doc/notice.html',
                                uploader: '小红'
                            }, {
                                name: '可下载文件002.doc',
                                url: '/doc/notice.html',
                                uploader: '小刚'
                            }
                        ]
                    }
                ],
                upFiles: [
                    {
                        date: '2019/12/10',
                        editable: true,
                        file: [
                            '上传的文件003.rar',
                            '上传的文件004.rar'
                        ]
                    }, {
                        date: '2019/10/28',
                        editable: false,
                        file: [
                            '上传的文件001.zip',
                            '上传的文件002.zip'
                        ]
                    }
                ]
            });
            break;
        default:
            break;
    }
}

module.exports = { student, teacher, dean, admin };