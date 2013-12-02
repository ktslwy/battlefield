'use strict';

var LightInfantry = require('../models/light-infantry'),
    HeavyInfantry = require('../models/heavy-infantry'),
    unitMap;

unitMap = {
    li: LightInfantry,
    hi: HeavyInfantry
};

function UnitFactory() {}

UnitFactory.prototype.buildUnit = function(config) {
    var self = this,
        unit;

    if (typeof config === 'string') {
        unit = self._buildUnitFromStandard(config);
    }

    return unit;
};

UnitFactory.prototype._buildUnitFromStandard = function(unitKey) {
    if (unitMap[unitKey]) {
        return new unitMap[unitKey]();
    }
};

module.exports = UnitFactory;