const mysql = require('./sql'),
    email = require('./email'),
    draw = require('./draw');

function _queryEmailAddrToArray({ sql, identity, then } = {}) {
    let sql_query = sql || 'SELECT email FROM ??' + (Array.isArray(identity) ? ' UNION SELECT email FROM ??'.repeat(identity.length - 1) : '');
    mysql.find(sql_query, identity).then(results => {
        let addr = [];
        for (let i = 0; i < results.length; i++) {
            addr.push(results[i].email);
        }
        if (addr.length > 0) {
            then(addr);
        }
    }).catch(err => {
        console.log(err);
    });
}

function _queryNumberToTables({ sql, captionArray, then } = {}) {
    mysql.find(sql).then(results => {
        let paragraph = [];
        //需判断是否只查了一个表
        for (let i = 0; i < results.length; i++) {
            if (results[i].length > 0) {
                paragraph.push(email.tableTemplate({ caption: captionArray[i], tableItems: results[i] }));
            }
        }
        if (paragraph.length > 0) {
            then(paragraph);
        }
    });
}

function _sendEmail({ sql, identity = 'admin', title, paragraph }) {
    return () => {
        _queryEmailAddrToArray({
            sql,
            identity,
            then: addr => {
                email._send({
                    to: addr,
                    html: email.emailTemplate({ title, paragraph })
                });
            }
        });
    }
}

function _sendInfoToAdmin({ sql, title, captionArray = ['学生', '教师', '系主任'] } = {}) {
    return () => {
        _queryNumberToTables({
            sql,
            captionArray,
            then: paragraph => {
                _sendEmail({
                    html: {
                        title,
                        paragraph
                    }
                });
            }
        });
    }
}

module.exports = {
    "open": [
        {
            "time": 5 * 60 * 1000,
            "func": _sendEmail({
                title: '系统开启',
                paragraph: [`毕设选题系统已经开启，请管理员尽快设定系统各阶段运行时间，通知师生修改密码、绑定邮箱，同时更新所需个人信息。`]
            })
        }, {
            "time": -30 * 60 * 1000,
            "func": _sendEmail({
                sql: 'SELECT email FROM teacher WHERE tele="" AND email!=""',
                title: '未完善资料',
                paragraph: [`您未填写您的详细资料，请前往系统填写。离更改资料功能关闭还有30分钟，关闭后将不可更改。因资料不完善而导致选题过程中出现问题，请自行承担责任。`]
            })
        }, {
            "time": -10 * 60 * 1000,
            "func": _sendInfoToAdmin({
                sql: 'SELECT stuNum student FROM student WHERE email IS NULL;SELECT teaNum FROM teacher WHERE email IS NULL;SELECT teaNuM FROM dean WHERE email IS NULL',
                title: '未设置邮箱人员名单'
            })
        }
    ],
    "submit": [
        {
            "time": 5 * 60 * 1000,
            "func": _sendEmail({
                identity: ['teacher', 'admin'],
                title: '提交课题',
                paragraph: [`请各位老师注意，可以开始提交课题了，每人提交课题上限为3个。`]
            })
        }, {
            "time": -30 * 60 * 1000,
            "func": _sendEmail({
                identity: ['teacher', 'admin'],
                title: '提交课题阶段即将结束',
                paragraph: [`请各位老师注意，提交课题阶段将在30分钟后结束，未提交课题的老师请尽快提交。`]
            })
        }, {
            "time": -10 * 60 * 1000,
            "func": _sendInfoToAdmin({
                sql: 'SELECT teaNum FROM teacher WHERE bysj IS NULL',
                title: '未提交课题教师名单',
                captionArray: [`教师`]
            })
        }
    ],
    "review": [
        {
            "time": 5 * 60 * 1000,
            "func": _sendEmail({
                identity: ['dean', 'admin'],
                title: '初次审核',
                paragraph: [`请管理员和各位系主任注意，可以开始第一次课题审核了。`]
            })
        }, {
            "time": -30 * 60 * 1000,
            "func": _sendEmail({
                identity: ['dean', 'admin'],
                title: '初次审核阶段即将结束',
                paragraph: [`请管理员和各位系主任注意，初次审核阶段将在30分钟后结束，未审核课题的系主任请尽快审核完成。`]
            })
        }, {
            "time": -10 * 60 * 1000,
            "func": _sendInfoToAdmin({
                sql: 'SELECT name,teaNum FROM dean d WHERE EXISTS(SELECT 1 FROM bysj b WHERE b.state=0 AND b.`group`=d.`group`)',
                title: '初次审核为完成系主任名单',
                captionArray: [`系主任`]
            })
        }
    ],
    "modify": [
        {
            "time": 5 * 60 * 1000,
            "func": _sendEmail({
                identity: ['teacher', 'admin'],
                title: '修改课题',
                paragraph: [`请管理员和各位老师注意，第一次课题审核完毕，老师们可以查看课题审核情况。被打回的课题可以修改之后再次提交，若不修改或第二次审核仍被打回，则该课题将被系统自动删除。`]
            })
        }, {
            "time": -30 * 60 * 1000,
            "func": _sendEmail({
                identity: ['teacher', 'admin'],
                title: '修改课题阶段即将结束',
                paragraph: [`请管理员和各位老师注意，修改课题阶段将在30分钟后结束，未修改课题的老师请尽快修改完成。`]
            })
        }
    ],
    "release": [
        {
            "time": 5 * 60 * 1000,
            "func": _sendEmail({
                identity: ['dean', 'admin'],
                title: '二次审核',
                paragraph: [`请管理员和各位系主任注意，可以开始第二次审核了。`]

            })
        }, {
            "time": -30 * 60 * 1000,
            "func": _sendEmail({
                identity: ['dean', 'admin'],
                title: '二次审核即将结束',
                paragraph: [`请管理员和各位系主任注意，二次审核阶段将在30分钟后结束，未审核课题的系主任请尽快审核完成。`]

            })
        }, {
            "time": -10 * 60 * 1000,
            "func": _sendInfoToAdmin({
                sql: 'SELECT name,teaNum FROM dean d WHERE EXISTS(SELECT 1 FROM bysj b WHERE b.state=0 AND b.`group`=d.`group`)',
                title: '二次审核未完成系主任名单',
                captionArray: [`系主任`]
            })
        }
    ],
    "choose": [
        {
            "time": 0,
            "func": () => {
                let sql_delete = 'DELETE FROM bysj WHERE state=-1';
                mysql.find(sql_delete).then(info => {
                    console.log(info);
                    console.log(`废弃课题已全部删除！共删除了${info.affectedRows}个课题。`);
                });
            }
        }, {
            "time": 5 * 60 * 1000,
            "func": _sendEmail({
                identity: ['student', 'admin'],
                title: '预选开始',
                paragraph: [`请各位同学注意，可以开始选题了！本次为预选阶段，若本次没有进行选择，则可在补选改选阶段再进行选择。`]
            })
        }, {
            "time": -30 * 60 * 1000,
            "func": _sendEmail({
                identity: ['student', 'admin'],
                title: '预选即将结束',
                paragraph: [`请各位同学注意，预选阶段将在30分钟后结束，未选题的同学请尽快选题。`]
            })
        }, {
            "time": -10 * 60 * 1000,
            "func": _sendInfoToAdmin({
                sql: 'SELECT name,stuNum FROM student WHERE bysj IS NULL',
                title: '未预选学生名单',
                captionArray: [`学生`]
            })
        }
    ],
    "draw": [
        {
            "time": 1 * 60 * 1000,
            "func": _sendEmail({
                title: '抽签即将开始',
                paragraph: [`请管理员注意，抽签将在30分钟后开始。`]
            })
        }, {
            "time": 5 * 60 * 1000,
            "func": () => {
                draw().then(_sendEmail({
                    title: '抽签成功',
                    paragraph: [`请管理员注意，抽签已经完成。`]
                })).catch(err => {
                    console.log(err);
                    _sendEmail({
                        title: '抽签失败',
                        paragraph: [`请管理员注意，因系统故障，抽签失败，请联系维护人员。`]
                    })();
                });
            }
        }
    ],
    "publicity": [
        {
            "time": 5 * 60 * 1000,
            "func": _sendEmail({
                identity: ['student', 'admin'],
                title: '抽签完成',
                paragraph: [`请同学们注意，抽签已经完成，请登陆系统查看自己的抽签情况，如未抽中，可在补改选阶段进行补选，补改选不抽签，即选即中。`]
            })
        }, {
            "time": -30 * 60 * 1000,
            "func": _sendEmail({
                identity: ['student', 'admin'],
                title: '补改选即将开始',
                paragraph: [`请同学们注意，补改选将在30分钟后开始。补改选不抽签，即选即中。`]
            })
        }
    ],
    "final": [
        {
            "time": 5 * 60 * 1000,
            "func": _sendEmail({
                identity: ['student', 'admin'],
                title: '补改选开始',
                paragraph: [`请同学们注意，补改选阶段已经开始，补改选不抽签，即选即中。`]
            })
        }, {
            "time": -30 * 60 * 1000,
            "func": _sendEmail({
                identity: ['student', 'admin'],
                title: '补改选即将结束',
                paragraph: [`请同学们注意，补改选将在30分钟后结束。若没有进行选择，将由系统进行调剂。`]
            })
        }
    ],
    "general": [
        {
            "time": 5 * 60 * 1000,
            "func": _sendEmail({
                identity: ['student', 'teacher', 'admin'],
                title: '选题结束',
                paragraph: [`各位老师、同学们，毕业设计选题已经结束，师生可在系统上交流有关毕业设计的信息。`]
            })
        }, {
            "time": -30 * 60 * 1000,
            "func": _sendEmail({
                identity: ['student', 'teacher', 'admin'],
                title: '系统即将关闭',
                paragraph: [`请老师同学们注意，系统将在30分钟后关闭，若有未完成的操作，请及时完成。`]
            })
        }
    ],
    "close": [
        {
            "time": 5 * 60 * 1000,
            "func": _sendEmail({
                title: '请管理员关闭系统',
                paragraph: [`毕业设计工作已经结束，请管理员在导出信息后关闭系统。`]
            })
        }
    ]
};