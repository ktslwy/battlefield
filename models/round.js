'use strict';

var _           = require('lodash'),
    BaseUnit    = require('./base-unit'),
    positionMap = require('../lib/position-map');

function Round(config) {
    var self = this;

    if (config) {
        self.roundNumber = config.roundNumber;
        self._leftFormation = config.leftFormation;
        self._rightFormation = config.rightFormation;
    }
}

Round.prototype.roundNumber = 0;

Round.prototype._leftFormation = null;

Round.prototype._rightFormation = null;

Round.prototype.startState = null;

Round.prototype.endState = null;

Round.prototype._allUnits = null;

Round.prototype._queue = null;

Round.prototype.actions = null;

Round.prototype.setupQueue = function() {
    var self    = this,
        units   = self._getRoundUnits();

    self._queue = _.shuffle(units);
};

Round.prototype.executeQueue = function() {
    var self = this,
        queue = self._queue;

    self.startState = self._getState();
    self.actions = [];

    queue.forEach(function(unit){
        if (!unit.isAlive()) {
            return;
        }

        var targetUnit = self._getTargetUnit(unit),
            damage;

        if (targetUnit) {
            damage = unit.attack(targetUnit);
            self._recordAction(unit, targetUnit, damage);
        }
    });

    self.endState = self._getState();
    self._finalize();
};

Round.prototype._getState = function() {
    var self = this;

    return {
        leftFormation: self._leftFormation.getData(),
        rightFormation: self._rightFormation.getData()
    };
};

Round.prototype._finalize = function() {
    var self = this;

    delete self._leftFormation;
    delete self._rightFormation;
    delete self._allUnits;
    delete self._queue;
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
        self._allUnits = self._leftFormation.formation.concat(self._rightFormation.formation);
    }

    return self._allUnits;
};

Round.prototype._getTargetUnit = function (unit) {
    var self            = this,
        unitPosition    = unit.position,
        unitSide        = unit.side,
        unitRow         = Math.floor((unitPosition - 1) / 5),
        targetPositions = positionMap[unitRow],
        targetSide      = unitSide === BaseUnit.SIDE_LEFT ? BaseUnit.SIDE_RIGHT : BaseUnit.SIDE_LEFT,
        targetFormation = targetSide === BaseUnit.SIDE_LEFT ? self._leftFormation : self._rightFormation,
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

Round.prototype._recordAction = function(unit, targetUnit, damage) {
    var self = this;

    self.actions.push({
        source: {
            position:   unit.position,
            side:       unit.side
        },
        target: {
            position:   targetUnit.position,
            side:       targetUnit.side
        },
        effects: [{
            attribute:  'healthPoint',
            change:     -damage
        }]
    });
};

module.exports = Round;