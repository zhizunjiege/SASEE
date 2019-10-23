const [schedule, fs, path] = superApp.requireAll(['node-schedule', 'fs', 'path']);

function FSM({ cercular = false, recoverable = true, relatedFile = 'fsm.json', states = null, script } = {}) {
    this.cercular = Boolean(cercular);
    this.recoverable = Boolean(recoverable);
    this.script = script;
    this.states = states;
    this.lastWriteTime = new Date();
    this.initialized = false;
    this.completed = false;
    this._curState = 0;
    this._curJobs = null;
    if (recoverable) {
        this.relatedFile = path.resolve(relatedFile);
        fs.promises.readFile(this.relatedFile, {
            encoding: 'utf8'
        }).then((function (data) {
            let recovery = JSON.parse(data);
            this.initialized = recovery.initialized;
            this.completed = recovery.completed;
            this.lastWriteTime = new Date(recovery.lastWriteTime);
            this.states = recovery.states;
            this._curState = recovery._curState;
            if (this.initialized) {
                this.registerSchedule();
            }
        }).bind(this)).catch(err => {
            console.log(err);
        });
    }
}

const proto = FSM.prototype;

proto.initialize = function (states) {
    if (this.initialized) {
        return Promise.reject('系统已经初始化！');
    }
    for (let i = 0; i < this.states.length; i++) {
        const state = this.states[i];
        if (state.name != states[i].name) {
            throw new Error('状态不匹配！');
        }
        if (!states[i].start) {
            throw new Error('未设置参数！');
        }
        state.start = states[i].start;
        state.end = states[i].end || states[i + 1] ? states[i + 1].start : null;
    }
    this.lastWriteTime = new Date();
    this.registerSchedule();
    this.initialized = true;
    if (this.recoverable) {
        return this.store();
    } else {
        return Promise.resolve('初始化成功！');
    }
};
proto.registerSchedule = function () {
    let state = this.states[this._curState],
        start = new Date(state.start).getTime(),
        end = new Date(state.end || start + 1 * 24 * 3600 * 1000).getTime(),
        immFunc = null;
    if (!state.start) {
        throw new Error('时间参数有误！');
    }
    for (const iterator of state.script) {
        if (iterator.time == 0) {
            immFunc = this.script[iterator.func].bind(this, iterator.parameter);
        } else if (iterator.time > 0) {
            schedule.scheduleJob(new Date(start + iterator.time), this.script[iterator.func].bind(this, iterator.parameter));
        } else {
            schedule.scheduleJob(new Date(end + iterator.time), this.script[iterator.func].bind(this, iterator.parameter));
        }
    }
    schedule.scheduleJob(new Date(end), this.next.bind(this));
    this._curJobs = schedule.scheduledJobs;
    immFunc && immFunc();
};
proto.cancelSchedule = function () {
    if (!this._curJobs) {
        return;
    }
    for (const iterator of Object.values(this._curJobs)) {
        iterator.cancel();
    }
};
proto.next = function () {
    if (this.initialized) {
        if (this._curState >= this.states.length - 1) {
            this.completed = true;
            this._curState = this.states.length;
        } else {
            this.cancelSchedule();
            this._curState++;
            this.registerSchedule();
        }
        return this.store();
    } else {
        return Promise.reject('系统尚未初始化！');
    }
};

proto.update = function (name, start, end) {
    if (this.initialized) {
        for (const iterator of this.states) {
            if (iterator.name == name) {
                start && (iterator.start = start);
                end && (iterator.end = end);
                this.lastWriteTime = new Date();
                this.cancelSchedule();
                this.registerSchedule();
                return this.store();
            }
        }
        return Promise.reject('没有对应状态！');
    } else {
        return Promise.reject('系统尚未初始化！');
    }
};

proto.store = function () {
    return fs.promises.writeFile(this.relatedFile, JSON.stringify({
        initialized: this.initialized,
        completed: this.completed,
        _curState: this._curState,
        lastWriteTime: this.lastWriteTime.toLocaleString(),
        states: this.states
    })).catch(err => {
        console.log(err);
    });
}

proto.permiss = function (param) {
    let stateSet = new Set();
    if (Array.isArray(param) && param.length > 0) {
        for (const iterator of param) {
            stateSet.add(iterator);
        }
        return stateSet.has(this.states[this._curState].name);
    }
    throw new Error('参数错误！');
};
proto.now = function () {
    return { name, description, start, end } = this.states[this._curState];
};
proto.info = function () {
    return this.states.map(cur => {
        return {
            "name": cur.name,
            "description": cur.description,
            "start": cur.start,
            "end": cur.end
        }
    });
}

module.exports = FSM;