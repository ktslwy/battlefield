'use strict';

var LightInfantry = require('../models/light-infantry'),
    HeavyInfantry = require('../models/heavy-infantry'),
    unitMap;

unitMap = {
    li: LightInfantry,
    hi: HeavyInfantry
};

function UnitFactory() {}

UnitFactory.prototype.getUnits = function() {
    return [
        LightInfantry,
        HeavyInfantry
    ];
};

UnitFactory.prototype.buildUnit = function(config) {
    if (!config) {
        return;
    }

    var self = this,
        unit;

    if (typeof config.type === 'string') {
        unit = self._buildUnitFromStandard(config.type);
        unit.position = config.position;
    }

    return unit;
};

UnitFactory.prototype._buildUnitFromStandard = function(unitKey) {
    if (unitMap[unitKey]) {
        return new unitMap[unitKey]();
    }
};

module.exports = UnitFactory;