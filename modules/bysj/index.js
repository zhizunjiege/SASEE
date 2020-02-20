const express = require('express'), app = express();

function getComponentName(identity, component) {
    switch (component) {
        case 'user-info':
        case 'perfect-info': return `${component}-${identity}.js`;
        default: return component + '.js';
    }
}


module.exports = { getComponentName, app, route: '/bysj' };