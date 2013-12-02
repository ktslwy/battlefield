'use strict';

var BaseUnit = require('./base-unit');

function HeavyInfantry() {}

HeavyInfantry.prototype = new BaseUnit();

HeavyInfantry.prototype.stats = {

    healthPoint: 20,

    attack: 1,

    defense: 2,

    actionInterval: 2

};

HeavyInfantry.prototype.toString = function() {
    return '[HeavyInfantry]';
};

module.exports = HeavyInfantry;