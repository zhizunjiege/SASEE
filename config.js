global.superApp = {
    resourses: {},
    userModules: {},
    startTime: new Date().toLocaleString(),
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
        "documents":{
            "license":"LICENSE",
            "manual":"MANUAL"
        }
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
            "util": "util"
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
            "script": "script"
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