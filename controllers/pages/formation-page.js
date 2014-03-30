'use strict';

var appConfig   = require('../../configs/app'),
    UnitFactory = require('../../lib/unit-factory'),
    uuid        = require('node-uuid');

module.exports = function(req, res){
    var query       = req.query,
        cookies     = req.cookies,
        unitFactory = new UnitFactory(),
        units       = unitFactory.getUnits();

    units = units.map(function(UnitClass){
        return new UnitClass().getData();
    });

    if (!cookies || !cookies.uuid) {
        res.cookie('uuid', uuid.v4(), {maxAge: 2592000000});
    }

    res.render('formation', {
        pageType: 'formation',
        query: query,
        appConfig: appConfig,
        units: units
    });
};