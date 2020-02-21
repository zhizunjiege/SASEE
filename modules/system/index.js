const express = require('express'),
    { mysql } = superApp.requireUserModules(['mysql']);

const app = express();

function getComponentName(identity, component) {
    switch (component) {
        case 'project-list':
        case 'project-content': return `${component}-${identity}.js`;
        default: return component + '.js';
    }
}

app.get('/manual', (req, res) => {
    res.do(async () => {
        res.sendFile(`${req.session.identity}.html`, { root: `${__dirname}/resources/html/manual` });
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

app.get('/news-content', (req, res) => {
    let { id } = req.query;
    res.do(async () => {
        res.sendFile(`${id}.html`, { root: `${__dirname}/resources/html/news` });
    });
});

module.exports = { getComponentName, app, route: '/system' };