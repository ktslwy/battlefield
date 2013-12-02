'use strict';

var _           = require('lodash'),
    positionMap = require('../lib/position-map'),
    BaseUnit    = require('./base-unit');

function Battle(config) {
    var self = this;

    if (config) {
        self.leftFormation  = config.leftFormation;
        self.rightFormation = config.rightFormation;
    }

    if (self.leftFormation) {
        self.leftFormation.setSide(BaseUnit.SIDE_LEFT);
    }

    if (self.rightFormation) {
        self.rightFormation.setSide(BaseUnit.SIDE_RIGHT);
    }
}

Battle.prototype.round = 1;

Battle.prototype.leftFormation = null;

Battle.prototype.rightFormation = null;

Battle.prototype._allUnits = null;

Battle.prototype._roundQueue = null;

Battle.prototype._getAllUnits = function() {
    var self = this;

    if (!self._allUnits) {
        self._allUnits = self.leftFormation.formation.concat(self.rightFormation.formation);
    }

    return self._allUnits;
};

Battle.prototype._setupRoundQueue = function() {
    var self    = this,
        units   = self._getCurrentRoundUnits();

    self._roundQueue = _.shuffle(units);
};

Battle.prototype._getCurrentRoundUnits = function() {
    var self    = this,
        round   = self.round,
        units   = self._getAllUnits();

    return units.filter(function(unit){
        return round % unit.stats.actionInterval === 0;
    });
};

Battle.prototype._getTargetUnit = function (unit) {
    var self            = this,
        unitPosition    = unit.position,
        unitSide        = unit.side,
        unitRow         = Math.floor(unitPosition/5),
        targetPositions = positionMap[unitSide][unitRow],
        targetSide      = unitSide === BaseUnit.SIDE_LEFT ? BaseUnit.SIDE_RIGHT : BaseUnit.SIDE_LEFT,
        targetFormation = targetSide === BaseUnit.SIDE_LEFT ? self.leftFormation : self.rightFormation,
        targetUnit;

    targetPositions.some(function(position){
        var foundUnit = targetFormation.getUnitByPosition(position);
        if (foundUnit && foundUnit.isAlive()) {
            targetUnit = foundUnit;
            return true;
        }
        return false;
    });

    return targetUnit;
};

module.exports = Battle;