const express = require('express'), app = express();

function getComponentName(identity, component) {
    switch (component) {
        case 'project-list':
        case 'project-content': return `${component}-${identity}.js`;
        default: return component + '.js';
    }
}


module.exports = { getComponentName, app, route: '/bysj' };