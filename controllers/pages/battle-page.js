'use strict';

var index       = require('../../index'),
    appConfig   = require('../../configs/app');

module.exports = function(req, res){
    var query       = req.query,
        battleData  = index(query.left, query.right),
        format      = query.format;

    if (format === 'json') {
        res.json(battleData);
    } else {
        res.render('battle', {
            query: query,
            battleData: battleData,
            appConfig: appConfig
        });
    }
};