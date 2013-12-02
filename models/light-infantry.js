'use strict';

function LightInfantry() {}

LightInfantry.prototype.stats = {

    healthPoint: 20,

    attack: 1,

    defense: 1,

    actionInterval: 1

};

LightInfantry.prototype.toString = function() {
	return '[LightInfantry]';
};

module.exports = LightInfantry;