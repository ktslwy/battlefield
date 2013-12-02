'use strict';

var _           = require('lodash'),
    UnitFactory = require('../lib/unit-factory'),
    unitFactory = new UnitFactory();

function UnitFormation(config) {
    if (config) {
        this.formation = _.cloneDeep(config.formation);
    }

    if (this.formation) {
        this._initFormation();
    }
}

UnitFormation.prototype.formation = null;

UnitFormation.prototype._initFormation = function() {
    var self = this,
        formation = self.formation;

    formation.forEach(function(entry){
        if (entry.unit) {
            entry.unit = unitFactory.buildUnit(entry.unit);
        }
    });
};

module.exports = UnitFormation;