'use strict';

var _ = require('lodash');

function Combat(config) {
    var self = this;

    if (config) {
        self.leftFormation  = config.leftFormation;
        self.rightFormation = config.rightFormation;
    }
}

Combat.prototype.round = 1;

Combat.prototype.leftFormation = null;

Combat.prototype.rightFormation = null;

Combat.prototype._allUnits = null;

Combat.prototype._roundQueue = null;

Combat.prototype._getAllUnits = function() {
    var self = this;

    if (!self._allUnits) {
        self._allUnits = self.leftFormation.formation.concat(self.rightFormation.formation);
    }

    return self._allUnits;
};

Combat.prototype._setupRoundQueue = function() {
    var self    = this,
        units   = self._getCurrentRoundUnits();

    self._roundQueue = _.shuffle(units);
};

Combat.prototype._getCurrentRoundUnits = function() {
    var self    = this,
        round   = self.round,
        units   = self._getAllUnits();

    return units.filter(function(unit){
        return round % unit.unit.stats.actionInterval === 0;
    });
}

module.exports = Combat;