const express = require('express'), app = express();

function getComponentName(identity, component) {
    return component;
}

app.get('/manual', (req, res) => {
    res.do(async () => {
        res.sendFile(`manual-${req.session.identity}.html`, { root: `${__dirname}/resources` });
    });
});

module.exports = { getComponentName, app, route: '/bysj' };