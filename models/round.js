'use strict';

var _           = require('lodash'),
    BaseUnit    = require('./base-unit'),
    positionMap = require('../lib/position-map');

function Round(config) {
    var self = this;

    if (config) {
        self.roundNumber = config.roundNumber;
        self.leftFormation = config.leftFormation;
        self.rightFormation = config.rightFormation;
    }
}

Round.prototype.roundNumber = 0;

Round.prototype.leftFormation = null;

Round.prototype.rightFormation = null;

Round.prototype.startState = null;

Round.prototype.endState = null;

Round.prototype._allUnits = null;

Round.prototype._queue = null;

Round.prototype.setupQueue = function() {
    var self    = this,
        units   = self._getRoundUnits();

    self._queue = _.shuffle(units);
};

Round.prototype.executeQueue = function() {
    var self = this,
        queue = self._queue;

    self.startState = self._getState();

    queue.forEach(function(unit){
        if (!unit.isAlive()) {
            return;
        }

        var targetUnit = self._getTargetUnit(unit);

        if (targetUnit) {
            unit.attack(targetUnit);
        }
    });

    self.endState = self._getState();
    self._finalize();
};

Round.prototype._getState = function() {
    var self = this;

    return {
        leftFormation: self.leftFormation.getData(),
        rightFormation: self.rightFormation.getData()
    }
};

Round.prototype._finalize = function() {
    var self = this;

    self.leftFormation = null;
    self.rightFormation = null;
};

Round.prototype._getRoundUnits = function() {
    var self        = this,
        units       = self._getAllUnits(),
        roundNumber = self.roundNumber;

    return units.filter(function(unit){
        return unit.isAlive() && (roundNumber % unit.stats.actionInterval === 0);
    });
};

Round.prototype._getAllUnits = function() {
    var self = this;

    if (!self._allUnits) {
        self._allUnits = self.leftFormation.formation.concat(self.rightFormation.formation);
    }

    return self._allUnits;
};

Round.prototype._getTargetUnit = function (unit) {
    var self            = this,
        unitPosition    = unit.position,
        unitSide        = unit.side,
        unitRow         = Math.floor((unitPosition - 1) / 5),
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

module.exports = Round;