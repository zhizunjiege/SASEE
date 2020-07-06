const { express, multer, path } = superApp.requireAll(['express', 'multer', 'path']),
    { mysql, file } = superApp.requireUserModules(['mysql', 'file']);

const app = express();

const CONFIG = file.readJson(`${__dirname}/config.json`);

app.get('/news-content', (req, res) => {
    let { id } = req.query;
    res.do(async () => {
        res.sendFile(`${id}.html`, { root: `${__dirname}/resources/html/news` });
    });
});

app.get('/manual', (req, res) => {
    let identity = req.query.identity || req.session.identity;
    res.do(async () => {
        res.sendFile(`${identity}.html`, { root: `${__dirname}/resources/html/manual` });
    });
});


app.get('/license', (req, res) => {
    res.do(async () => {
        res.sendFile(`license.html`, { root: `${__dirname}/resources/html` });
    });
});

app.get('/img', (req, res) => {
    res.do(async () => {
        res.sendFile(req.query.file, { root: `${__dirname}/resources/img` });
    });
});

app.get('/news-list', (req, res) => {
    let { length: limit, start: offset } = req.query,
        sql_query = 'SELECT * FROM news ORDER BY top DESC,id DESC LIMIT ? OFFSET ?';
    res.do(async () => {
        let result = await mysql.find(sql_query, [Number(limit), Number(offset)]);
        res.json({
            status: true,
            news: result
        });
    });
});

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, 'tmp'));
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    })
});

let receiver = upload.single('file');

app.post('/write-news', receiver, (req, res) => {
    let { top, title, content } = req.body,
        sql_insert = 'INSERT INTO news (top,title,date) VALUES (?,?,CURDATE())';
    res.do(async () => {
        let rst = await mysql.find(sql_insert, [top, title]);
        await file.writeFile(`${__dirname}/resources/html/news/${rst.insertId}.html`, content);
        res.json({
            status: true,
            msg: '通知发布成功！'
        });
    });
});

app.post('/write-license', receiver, (req, res) => {
    let { content } = req.body;
    res.do(async () => {
        await file.writeFile(`${__dirname}/resources/html/license.html`, content);
        res.json({
            status: true,
            msg: '协议发布成功！'
        });
    });
});

app.post('/write-manual', receiver, (req, res) => {
    let b = req.body;
    res.do(async () => {
        for (const k of Object.keys(b)) {
            await file.writeFile(`${__dirname}/resources/html/manual/${k}.html`, b[k]);
        }
        res.json({
            status: true,
            msg: '手册发布成功！'
        });
    });
});

app.get('/user-manage', (req, res) => {
    let sql_query = 'SELECT id,name,gender,schoolNum,specialty,SUBSTR(`group`,3) `group`,class,postGraduate FROM student;SELECT id,name,gender,schoolNum,proTitle,SUBSTR(`group`,3) `group`,department,ifDean FROM teacher;SELECT id,name,gender,priv FROM admin;';
    res.do(async () => {
        let users = await mysql.find(sql_query);
        res.json({
            status: true,
            users
        });
    });
});

app.post('/add-user', (req, res) => {
    let { identity, info } = req.body,
        sql_insert = 'INSERT INTO ?? SET ?';
    info.group = `${CONFIG.group[info.group]}-${info.group}`;
    res.do(async () => {
        let rst = await mysql.find(sql_insert, [identity, info]);
        res.json({
            status: true,
            msg: '增加用户成功！',
            insertId: rst.insertId
        });
    });
});

app.post('/edit-user', (req, res) => {
    let { id, identity, info } = req.body,
        sql_update = 'UPDATE ?? SET ? WHERE id=?';
    info.group = `${CONFIG.group[info.group]}-${info.group}`;
    res.do(async () => {
        await mysql.find(sql_update, [identity, info, id]);
        res.json({
            status: true,
            msg: '修改用户信息成功！'
        });
    });
});

app.post('/del-user', (req, res) => {
    let { id, identity } = req.body,
        sql_update = 'DELETE FROM ?? WHERE id in ' + `(${id.join(',')})`;
    res.do(async () => {
        await mysql.find(sql_update, identity);
        res.json({
            status: true,
            msg: '删除用户成功！'
        });
    });
});

function getComponentName(identity, component) {
    return component + '.js';
}

module.exports = { getComponentName, app, route: '/system' };