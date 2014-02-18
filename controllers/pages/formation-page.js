'use strict';

var appConfig   = require('../../configs/app');

module.exports = function(req, res){
    var query       = req.query;

    res.render('formation', {
        query: query,
        appConfig: appConfig
    });
};