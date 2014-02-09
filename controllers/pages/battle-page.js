'use strict';

var index = require('../../index');

module.exports = function(req, res){
    var query       = req.query,
        battleData  = index(query.left, query.right);

    res.render('battle', {
        query: query,
        battleData: JSON.stringify(battleData)
    });
};