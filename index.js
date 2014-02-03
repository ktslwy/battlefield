'use strict';

var Battle           = require('./models/battle'),
    BattleController = require('./controllers/battle-controller'),
    allLiFormation   = require('./samples/formation/all-li'),
    allHiFormation   = require('./samples/formation/all-hi'),
    UnitFormation    = require('./models/unit-formation');

module.exports = function() {
    var battle,
        battleController,
        battleControllerConfig;

    battle = new Battle({
        leftFormation  : new UnitFormation({formation: allLiFormation}),
        rightFormation : new UnitFormation({formation: allHiFormation})
    });

    battleControllerConfig = {
        battle: battle
    };

    battleController = new BattleController(battleControllerConfig);
    battleController.startBattle();

    return battle;
};