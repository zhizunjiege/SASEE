const express = require('express'),
    { mysql, file, util } = superApp.requireUserModules(['mysql', 'file', 'util']);

const CONFIG = file.json(__dirname + '/config/map.json');

const app = express();
app.use((req, res, next) => {
    res.errors = CONFIG.errors;
    next();
});

app.get('/project-list', (req, res) => {
    let { length: limit, start: offset } = req.query,
        { uid } = req.session,
        sql_query = 'SELECT b.id,title,teacher,t.`name`,SUBSTR(t.`group`,3) `group`,(IFNULL(JSON_LENGTH(b.target1),0)+IFNULL(JSON_LENGTH(b.target2),0)+IFNULL(JSON_LENGTH(b.target3),0)) chosen FROM bysj b INNER JOIN teacher t ON b.teacher=t.id INNER JOIN student s ON t.`group`=s.`group`||s.`group`="7-高工" WHERE s.id=? AND b.state="0-通过" AND b.student IS NULL ORDER BY b.id LIMIT ? OFFSET ?';
    res.do(async () => {
        let projects = await mysql.find(sql_query, [uid, Number(limit), Number(offset)]);
        res.json({
            status: true,
            projects
        });
    });
});

app.get('/info-project', (req, res) => {
    let sql_query = 'SELECT id,title,type,source,difficulty,weight,ability,requirement,introduction,materials,submitTime,lastModifiedTime FROM bysj WHERE id=?';
    res.do(async () => {
        let [project] = await mysql.find(sql_query, req.query.id);
        res.json({
            status: true,
            project
        });
    });
});
app.get('/info-teacher', (req, res) => {
    let sql_query = 'SELECT `name`,gender,schoolNum,proTitle,SUBSTR(`group`,3) `group`,department,field,office,email,homepage,wechat,tel,resume FROM teacher WHERE id=?';
    res.do(async () => {
        let [teacher] = await mysql.find(sql_query, req.query.id);
        teacher = util.dataFilter(teacher, ['wechat', 'tel', 'homepage', 'resume', 'office', 'field']);
        res.json({
            status: true,
            teacher
        });
    });
});

app.get('/project-chosen', (req, res) => {
    let { uid } = req.session,
        start = 'SELECT b.id,title,teacher,t.`name`,SUBSTR(`group`,3) `group`,(IFNULL(JSON_LENGTH(b.target1),0)+IFNULL(JSON_LENGTH(b.target2),0)+IFNULL(JSON_LENGTH(b.target3),0)) chosen FROM bysj b INNER JOIN teacher t ON b.teacher=t.id WHERE JSON_CONTAINS(b.target',
        end = ',CONCAT("",?))',
        sql_query = '';
    res.do(async () => {
        let projects = [];
        for (let i = 1; i <= 3; i++) {
            sql_query = start + i + end;
            let result = await mysql.find(sql_query, uid);
            if (result.length) projects.push(result[0]);
            else projects.push(null);
        }
        res.json({
            status: true,
            projects
        });
    });
});

app.get('/project-mine', (req, res) => {
    let { uid } = req.session,
        sql_query = 'SELECT id,teacher FROM bysj WHERE student=?';
    res.do(async () => {
        let [result] = await mysql.find(sql_query, uid);
        if (!result) throw 21;
        let { id: pid, teacher: tid } = result;
        res.json({
            status: true,
            pid, tid
        });
    });
});

app.get('/project-notice', (req, res) => {
    let { pid } = req.query,
        sql_query = 'SELECT notice FROM bysj WHERE id=?';
    res.do(async () => {
        let [{notice:notices}] = await mysql.find(sql_query, pid);
        res.json({
            status: true,
            notices
        });
    });
});

app.get('/project-file', (req, res) => {
    let { pid } = req.query,
        sql_query = 'SELECT studentFiles,teacherFiles FROM bysj WHERE id=?';
    res.do(async () => {
        let [files] = await mysql.find(sql_query, pid);
        res.json({
            status: true,
            studentFiles: files.studentFiles,
            teacherFiles: files.teacherFiles
        });
    });
});

app.post('/choose', (req, res) => {
    let { id, target } = req.body,
        { uid } = req.session;
    // ifFinal = req.fsm.now().name == 'final';//需考虑不同时期的选择
    let sql_query1 = `SELECT 1 FROM bysj WHERE student=?;SELECT 1 FROM bysj WHERE student IS NOT NULL AND id=?`,
        sql_query2 = `SELECT id,target${target} target FROM bysj WHERE JSON_CONTAINS(target${target},CONCAT("",?))`,
        sql_update1 = `UPDATE bysj SET target${target}=? WHERE id=?`,
        sql_update2 = `UPDATE bysj SET target${target}=JSON_ARRAY_APPEND(target${target},"$",?) WHERE id=?`;

    res.do(async () => {
        let [re1, re2] = await mysql.find(sql_query1, [uid, id]);
        if (re1.length) throw 10;
        if (re2.length) throw 11;
        let conn = await mysql.transaction(),
            re3 = await conn.find(sql_query2, uid);
        if (re3.length) {
            re3[0].target.remove(uid);
            await conn.find(sql_update1, [JSON.stringify(re3[0].target), re3[0].id]);
        }
        await conn.find(sql_update2, [uid, id]);
        await conn.commitPromise();
        res.json({
            status: true,
            msg: '选择课题成功！'
        });
    });
});

app.post('/revoke', (req, res) => {
    let { id, target } = req.body,
        { uid } = req.session,
        sql_query = `SELECT target${target} target FROM bysj WHERE id=?`,
        sql_update = `UPDATE bysj SET target${target}=? WHERE id=?`;
    res.do(async () => {
        let [{ target: tar }] = await mysql.find(sql_query, id);
        tar.remove(uid);
        await mysql.find(sql_update, [JSON.stringify(tar), id]);
        res.json({
            status: true,
            msg: '退选课题成功！'
        });
    });
});

function getComponentName(identity, component) {
    switch (component) {
        case 'project-list':
        case 'project-content':
        case 'project-mine':
            component += `-${identity}`;
            break;
        default: ;
    }
    return component + '.js';
}

module.exports = { getComponentName, app, route: '/bysj' };