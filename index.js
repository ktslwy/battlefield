'use strict';

var Battle           = require('./models/battle'),
    BattleController = require('./controllers/battle-controller'),
    allLiFormation   = require('./samples/formation/all-li'),
    allHiFormation   = require('./samples/formation/all-hi'),
    UnitFormation    = require('./models/unit-formation'),
    battle,
    battleConfig,
    battleController,
    battleControllerConfig;

battleConfig = {
    leftFormation  : new UnitFormation({formation: allLiFormation}),
    rightFormation : new UnitFormation({formation: allHiFormation})
};
battle = new Battle(battleConfig);

battleControllerConfig = {
    battle: battle
};
battleController = new BattleController(battleControllerConfig);
battleController.startBattle();