'use strict';

var appConfig   = require('../../configs/app'),
    UnitFactory = require('../../lib/unit-factory');

module.exports = function(req, res){
    var query       = req.query,
        unitFactory = new UnitFactory(),
        units       = unitFactory.getUnits();

    units = units.map(function(UnitClass){
        return new UnitClass().getData();
    });

    res.render('formation', {
        pageType: 'formation',
        query: query,
        appConfig: appConfig,
        units: units
    });
};