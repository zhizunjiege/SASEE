const express = require('express'),
    [mysql, util] = superApp.requireUserModules(['mysql', 'util']),
    { NEWS, VIEWS_COMMON } = superApp.resourses;

function render(req, res) {
    let { sql_query, param, file, dir, extraData } = req.renderData;
    let path = dir ? dir + '/' + file : file;
    if (sql_query) {
        mysql.find(sql_query, param).then(data => {
            res.render(path, { PATH: superApp.resourses, data, extraData }, (err, html) => {
                if (err) {
                    console.log(err);
                    console.log(req);
                    res.status(403).send('页面渲染出错！');
                } else {
                    res.send(html);
                }
            });
        }).catch(util.catchError(res));
    } else if (path) {
        res.render(path, { PATH: superApp.resourses, data: null, extraData }, (err, html) => {
            if (err) {
                console.log(err);
                res.status(403).send('页面渲染出错！');
            } else {
                res.send(html);
            }
        });
    } else {
        res.end();
    }
}

const common = express.Router();
common.get('/news', (req, res, next) => {
    let { group } = req.session,
        condition = group ? ` WHERE JSON_CONTAINS(\`group\`,JSON_QUOTE("${group}"))` : '';
    req.renderData = {
        sql_query: `SELECT (SELECT COUNT(*) FROM news${condition}) total,n.* FROM news n${condition} ORDER BY top DESC,id DESC LIMIT 10 OFFSET 0`,
        file: 'contents-news',
        dir: VIEWS_COMMON
    };
    next();
}, render);
common.get('/newsList', (req, res, next) => {
    let { group } = req.session,
        condition = group ? ` WHERE JSON_CONTAINS(\`group\`,JSON_QUOTE("${group}"))` : '';
    req.renderData = {
        sql_query: `SELECT * FROM news${condition} ORDER BY top DESC,id DESC LIMIT 10 OFFSET ?`,
        param: ((Number(req.query.page) || 1) - 1) * 10,
        file: 'newsList',
        dir: VIEWS_COMMON
    };
    next();
}, render);
common.get('/newsContent', (req, res, next) => {
    req.renderData = {
        file: req.query.id,
        dir: NEWS
    };
    next();
}, render);
common.get('/manual', (req, res, next) => {
    req.renderData = {
        file: 'manual',
        dir: VIEWS_COMMON,
        extraData: req.session.identity
    };
    next();
}, render);

module.exports = { render, common };