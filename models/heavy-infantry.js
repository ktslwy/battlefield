'use strict';

var BaseUnit = require('./base-unit'),
    _        = require('lodash');

function HeavyInfantry() {
    var self = this;

    self.stats = _.clone(HeavyInfantry.baseStats);
}

HeavyInfantry.baseStats = {

    healthPoint: 20,

    attack: 1,

    defense: 2,

    actionInterval: 2

};

HeavyInfantry.prototype = new BaseUnit();

HeavyInfantry.prototype.name = 'HeavyInfantry';

HeavyInfantry.prototype.title = 'Heavy Infantry';

module.exports = HeavyInfantry;