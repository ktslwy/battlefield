'use strict';

var _           = require('lodash'),
    BaseUnit    = require('../models/battle');

function BattleController(config) {
    var self = this;

    if (config) {
        self.battle  = config.battle;
    }
}

BattleController.prototype.startBattle = function() {
    var self = this,
        battle = self.battle;

    if (battle) {
        battle.start();
    }
};

module.exports = BattleController;