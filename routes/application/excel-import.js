const xlsx = require('node-xlsx'),
    [mysql, file, util, hash] = superApp.requireUserModules(['mysql', 'file', 'util', 'hash']);

function importStudent(req, res) {
    let path = req.file.path;

    let sheet = xlsx.parse(path),
        index = sheet[0].data[0];

    let name_id = index.indexOf('姓名'),
        gender_id = index.indexOf('性别'),
        account_id = index.indexOf('学号'),
        class_id = index.indexOf('班级'),
        specialty_id = index.indexOf('专业'),
        group_id = index.indexOf('分组'),
        identityNum_id = index.indexOf('身份证号'),
        postgraduate_id = index.indexOf('是否保研');

    let raw = sheet[0].data, data = [];
    for (let i = 1; i < raw.length; i++) {
        let name = remove_space(raw[i][name_id]),
            gender = remove_space(raw[i][gender_id]),
            account = remove_space(raw[i][account_id]),
            _class = remove_space(raw[i][class_id]),
            specialty = remove_space(raw[i][specialty_id]),
            group = remove_space(raw[i][group_id]),
            identityNum = remove_space(raw[i][identityNum_id]).toUpperCase(),
            postgraduate = remove_space(raw[i][postgraduate_id]),
            password = hash.MD5('' + account + (identityNum.substr(-4) || ''));
        let param = [account, password, name, gender, account, specialty, _class, group, postgraduate || '否']
        if (util.paramIfValid(param)) {
            data.push(param);
        }
    }
    return sqlInsert('student', 'account, password, name, gender, stuNum, specialty, class, `group`, postgraduate', data)
        .then(() => {
            file.fs.unlinkSync(path);
            res.send('学生信息导入成功！');
        }).catch(util.catchError(res));;
}

function importTeacher(req, res) {
    let path = req.file.path;

    let sheet = xlsx.parse(path),
        index = sheet[0].data[0];

    let name_id = index.indexOf('姓名'),
        gender_id = index.indexOf('性别'),
        account_id = index.indexOf('工号'),
        proTtle_id = index.indexOf('职称'),
        group_id = index.indexOf('分组'),
        depart_id = index.indexOf('系别'),
        dean_id = index.indexOf('是否负责人');

    let raw = sheet[0].data, data = [], dean = [];
    for (let i = 1; i < raw.length; i++) {
        let name = remove_space(raw[i][name_id]),
            gender = remove_space(raw[i][gender_id]),
            account = remove_space(raw[i][account_id]),
            proTtle = remove_space(raw[i][proTtle_id]),
            group = remove_space(raw[i][group_id]),
            depart = remove_space(raw[i][depart_id]),
            password = hash.MD5('' + account);
        let param = [account, password, name, gender, account, proTtle, group, depart, '[]'];
        if (util.paramIfValid(param)) {
            data.push(param);
            if (dean_id > 0 && remove_space(raw[i][dean_id]) == '是') {
                dean.push([account, password, name, gender, group]);
            }
        }
    }
    sqlInsert('teacher', 'account, password, name, gender, teaNum, proTitle, `group`, department,bysj', data)
        .then(() => {
            if (dean.length) {
                return sqlInsert('dean', 'account, password, name, gender,`group`', dean);
            } else {
                return Promise.resolve();
            }
        }).then(() => {
            file.fs.unlinkSync(path);
            res.send('教师信息导入成功！');
        }).catch(util.catchError(res));
}

function sqlInsert(table, col, data) {
    let sql = `TRUNCATE TABLE ${table};INSERT INTO ${table} (${col}) VALUES `;
    for (let i = 0; i < data.length; i++) {
        let e = data[i], _sql = '(';
        for (let j = 0; j < e.length; j++) {
            _sql += '"' + e[j] + '"';
            if (j != e.length - 1) {
                _sql += ',';
            }
        }
        sql += _sql + ')';
        if (i != data.length - 1) {
            sql += ',';
        }
    }
    return mysql.transaction().then(conn => {
        return conn.find(sql);
    }).then(({ conn }) => {
        return conn.commitPromise();
    });
}

function remove_space(str = '') {
    return str.replace ? str.replace(/\s*/g, '') : str;
}

module.exports = { importTeacher, importStudent };