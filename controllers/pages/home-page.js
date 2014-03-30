'use strict';

var appConfig   = require('../../configs/app');

function handleHomePage(req, res) {
    var query = req.query;

    res.render('home', {
        pageType: 'home',
        query: query,
        appConfig: appConfig
    });
}

module.exports = handleHomePage;