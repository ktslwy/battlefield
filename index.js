'use strict';

var Battle           = require('./models/battle'),
    BattleController = require('./controllers/battle-controller'),
    LiLiFormation    = require('./samples/formation/li-li'),
    HiHiFormation    = require('./samples/formation/hi-hi'),
    LiHiFormation    = require('./samples/formation/li-hi'),
    HiLiFormation    = require('./samples/formation/hi-li'),
    UnitFormation    = require('./models/unit-formation'),
    formations;

formations = {
    'li-li': LiLiFormation,
    'hi-hi': HiHiFormation,
    'li-hi': LiHiFormation,
    'hi-li': HiLiFormation,
};

module.exports = function(left, right) {
    var battle,
        battleController,
        battleControllerConfig,
        leftFormation = formations[left],
        rightFormation = formations[right];

    if (!leftFormation || !rightFormation) {
        return;
    }

    battle = new Battle({
        leftFormation  : new UnitFormation({formation: leftFormation}),
        rightFormation : new UnitFormation({formation: rightFormation})
    });

    battleControllerConfig = {
        battle: battle
    };

    battleController = new BattleController(battleControllerConfig);
    battleController.startBattle();

    return battle;
};