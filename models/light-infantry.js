'use strict';

var BaseUnit = require('./base-unit'),
    _        = require('lodash');

function LightInfantry() {
    var self = this;

    self.stats = _.clone(LightInfantry.baseStats);
}

LightInfantry.baseStats = {

    healthPoint: 20,

    attack: 1,

    defense: 1,

    actionInterval: 1

};

LightInfantry.prototype = new BaseUnit();

LightInfantry.prototype.name = 'LightInfantry';

module.exports = LightInfantry;