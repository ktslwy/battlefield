'use strict';

var index       = require('../../index'),
    appConfig   = require('../../configs/app');

module.exports = function(req, res){
    var query       = req.query,
        left        = query.left || 'hi-li',
        right       = query.right || 'li-hi',
        battleData  = index(left, right),
        format      = query.format;

    if (format === 'json') {
        res.json(battleData);
    } else {
        res.render('battle', {
            pageType: 'battle',
            query: query,
            battleData: battleData,
            appConfig: appConfig
        });
    }
};