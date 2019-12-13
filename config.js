Date.prototype.toLocaleISOString = function () {
    return new Date(this.valueOf() - this.getTimezoneOffset() * 1000 * 60).toISOString().replace('Z', '');
};
Promise.allSettled = function (promiseArray) {
    let len = promiseArray.length,
        results = new Array(len);
    return new Promise(resolve => {
        for (let i = 0; i < len; i++) {
            let index = i;
            promiseArray[i].then(value => {
                results[index] = {
                    status: 'fulfilled',
                    value
                };
            }).catch(reason => {
                results[index] = {
                    status: 'rejected',
                    reason
                };
            }).finally(() => {
                let flag = true;
                for (let j = 0; j < len; j++) {
                    if (!results[j]) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    resolve(results);
                }
            });
        }
    });
};

global.superApp = {
    maxProjectsMap: {
        '讲师': 2,
        '副教授': 5,
        '教授': 7,
        '助理教授': 2,
        '特别研究员': 7,
        '助理研究员': 2,
        '实验师': 2,
        '工程师': 2
    },
    specialtyMap: {
        1: '自动化',
        2: '电气工程及其自动化',
        3: '高工'
    },
    groupMap: [
        '1-自动控制与模式识别',
        '2-自主导航与精确制导',
        '3-检测与自动化工程',
        '4-飞行器控制与仿真',
        '5-机电控制与液压',
        '6-电气',
        '7-高工'
    ],
    projectTypeMap: {
        1: '科学研究',
        2: '工程设计',
        3: '实验',
        4: '其他'
    },
    projectSourceMap: {
        1: '科学研究',
        2: '工程实际',
        3: '实验室建设',
        4: '假拟',
        5: '其他'
    },
    errorMap: {
        10: '密码错误，请稍后重试！',
        11: '课题数已达上限！',
        12: '你已经选择过该课题！',
        13: '该课题已满，请重新选择！',
        14: '账号或密码错误，请重试！',
        15: '旧密码错误,请重试！',
        16: '未找到该学生！',
        17: '该方向对外名额已满！',
        18: '你选择的课题已生效，无法更改！',
        19: '该学生已被其他老师确认！',
        20: '数据长度为0！',
        21: '收信人为空！',
        22: '该用户不存在！'
    },
    resourses: {},
    userModules: {},
    startTime: new Date().toLocaleISOString(),
    requireUserModule(name) {
        return require(this.userModules[name]);
    },
    requireUserModules(names) {
        let modules = [];
        for (const iterator of names) {
            modules.push(this.requireUserModule(iterator));
        }
        return modules;
    },
    requireAll(names) {
        let modules = [];
        for (const iterator of names) {
            modules.push(require(iterator));
        }
        return modules;
    }
};

const superApp = global.superApp;

function transObjToPath(cache, path, node) {
    if (node instanceof Object) {
        for (const [dir, nextNode] of Object.entries(node)) {
            transObjToPath(cache, path + '/' + dir, nextNode);
        }
    } else {
        cache[node] = path;
    }
}

/* fs模块使用cwd路径为根目录，随脚本启动位置不同而变化；而require函数使用__dirname，以文件间相对路径关系为准。
故模块加载只要使用相对路径即可，而资源定位需要绝对路径。为确保准确，本程序均使用绝对路径。 */

/* 各类资源 */
transObjToPath(superApp.resourses, __dirname, {
    "public": "PUBLIC",
    "resourses": {
        "news": "NEWS",
        "files": "FILES",
        "views": {
            "common": "VIEWS_COMMON",
            "admin": "VIEWS_ADMIN",
            "student": "VIEWS_STUDENT",
            "teacher": "VIEWS_TEACHER",
            "dean": "VIEWS_DEAN"
        },
        "documents": {
            "license": "LICENSE",
            "manual": "MANUAL",
            "config": "CONFIG"
        },
        "editorImg": "EDITOR_IMG"
    },
    "tmp": "TMP",
    "fsm.json": "fsm"
});

/* 用户编写模块 */
transObjToPath(superApp.userModules, __dirname, {
    "routes": {
        "service": {
            "file": "file",
            "mysql": "mysql",
            "util": "util",
            "object_hash": "hash"
        },
        "application": {
            "email": "email",
            "general": "general",
            "draw": "draw",
            "login": "login",
            "info": "info",
            "password": "password",
            "views": "views",
            "upload": "upload",
            "download": "download",
            "subject": "subject",
            "fsm": "fsm",
            "script": "script",
            "adjust": "adjust",
            "excel-import": "excelImport",
            "excel-export": "excelExport"
        },
        "user": {
            "admin": {
                "admin": "admin"
            },
            "student": {
                "student": "student"
            },
            "teacher": {
                "teacher": "teacher"
            },
            "dean": {
                "dean": "dean"
            }
        }
    }
});

module.exports = superApp;