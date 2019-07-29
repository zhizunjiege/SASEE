function view(req, res) {
    switch (req.query.type) {
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
            res.render('userInfo', {
                account: 17375433,
                status: {
                    specialty: '自动化',
                    subject: '模式识别',
                    class: '170326',
                    stuNum: '17375433',
                    name: '陈智杰',
                    gender: '男'
                },
                academic: {
                    gpa: 3.77,
                    weightAver: 91,
                    average: 89
                },
                qualification: {
                    bysj: true,
                    scsx: true,
                    zhsy: false
                }
            });
            break;
        case 'subject':
            res.render('subject', {
                num: 23,
                contents: (new Array(14)).fill({
                    title: '做个什么呢我也不太清楚',
                    derection: '301',
                    chosen: 5,
                    capacity: 7,
                    publisher: '某老师',
                    date: '2019/07/16'
                })
            });
            break;
        case 'subjectList':
            res.render('subjectList', {
                contents: (new Array(5)).fill({
                    title: '我也不知道要做什么',
                    derection: '302',
                    chosen: 5,
                    capacity: 7,
                    publisher: '某某老师',
                    date: '2019/07/16'
                })
            });
            break;
        case 'subjectContent':
            res.render('subjectContent', {
                subject: {
                    number: 3,
                    title: '基于那啥做那啥',
                    derection: '模式识别',
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
                    pro: '讲师',
                    field: '超电磁炮',
                    mail: '88888888@buaa.edu.cn'
                }
            });
            break;
        case 'mySubject':
            res.render('mySubject', {
                notice: new Array(5).fill({
                    top: true,
                    title: '准备开始开发了啊',
                    date: '2019/07/09',
                    content:'准备开始完成任务'
                }),
                asignment:[
                    {
                        title:'初步探讨',
                        deadline:'2019/11/13-12:00',
                        status:'已完成',
                        description:'本次任务的目的是完成初步的探讨····',
                        score:'98'
                    },{
                        title:'设计初稿',
                        deadline:'2019/11/23-08:00',
                        status:'不及格',
                        description:'本次任务的目的是进行进一步的设计，并提交设计初稿····',
                        score:'57'
                    },{
                        title:'最终成品',
                        deadline:'2019/12/03-00:00',
                        status:'未完成',
                        description:'本次任务的目的是完成最后的组装，形成最终成品····',
                        score:'暂无'
                    }
                ],
                teacher: {
                    profile:'cai.jpg',
                    name: '某某某',
                    gender: '女',
                    proTitle: '讲师',
                    field: '超电磁炮',
                    office:'新主楼F-407',
                    mail: '88888888@buaa.edu.cn',
                    tele:'166-6666-6666'
                },
                downFiles:[
                    {
                        date:'2019/11/20',
                        file:[
                            {
                                name:'可下载文件003.doc',
                                url:'/doc/notice.html'
                            },{
                                name:'可下载文件004.doc',
                                url:'/doc/notice.html'
                            }
                        ]
                    },{
                        date:'2019/10/24',
                        file:[
                            {
                                name:'可下载文件001.doc',
                                url:'/doc/notice.html'
                            },{
                                name:'可下载文件002.doc',
                                url:'/doc/notice.html'
                            }
                        ]
                    }
                ],
                upFiles:[
                    {
                        date:'2019/12/10',
                        editable:true,
                        file:[
                            '上传的文件003.rar',
                            '上传的文件004.rar'
                        ]
                    },{
                        date:'2019/10/28',
                        editable:false,
                        file:[
                            '上传的文件001.zip',
                            '上传的文件002.zip'
                        ]
                    }
                ]
            });
            break;
        case 'password':
            res.render('password',null);
            break;
        default:
            break;
    }
}
module.exports = view