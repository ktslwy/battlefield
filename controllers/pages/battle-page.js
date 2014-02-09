'use strict';

module.exports = function(req, res){
    var query = req.query,
        index = require('../../index'),
        battle = index(query.left, query.right);

    res.render('battle', {
        query: query
    });
};