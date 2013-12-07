'use strict';

var _           = require('lodash'),
    UnitFactory = require('../lib/unit-factory'),
    unitFactory = new UnitFactory();

function UnitFormation(config) {
    var self = this;

    if (config && config.formation) {
        self._initFormation(config.formation);
    }
}

UnitFormation.prototype.formation = null;

UnitFormation.prototype._initFormation = function(formationConfig) {
    var self = this;

    self.formation = formationConfig.map(function(entry){
        return unitFactory.buildUnit(entry);
    });
};

UnitFormation.prototype.setSide = function(side) {
    var self = this;

    self.formation.forEach(function(unit){
        unit.side = side;
    });
};

UnitFormation.prototype.getUnitByPosition = function(position) {
    var self = this,
        foundUnit;

    self.formation.some(function(unit){
        if (unit.position === position) {
            foundUnit = unit;
            return true;
        }
        return false;
    });

    return foundUnit;
};

UnitFormation.prototype.areSomeAlive = function() {
    var self = this;

    return self.formation.some(function(unit){
        return unit.isAlive();
    });
};

UnitFormation.prototype.toString = function() {
    var self = this,
        string = '';

    self.formation.forEach(function(unit){
        string += unit.toString() + '\n';
    });

    return string;
};

module.exports = UnitFormation;