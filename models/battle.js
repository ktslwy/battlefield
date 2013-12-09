'use strict';

var BaseUnit    = require('./base-unit'),
    Round       = require('./round');

function Battle(config) {
    var self = this;

    if (config) {
        self.leftFormation  = config.leftFormation;
        self.rightFormation = config.rightFormation;
    }

    if (self.leftFormation) {
        self.leftFormation.setSide(BaseUnit.SIDE_LEFT);
    }

    if (self.rightFormation) {
        self.rightFormation.setSide(BaseUnit.SIDE_RIGHT);
    }
}

Battle.prototype.currentRoundNumber = 0;

Battle.prototype.leftFormation = null;

Battle.prototype.rightFormation = null;

Battle.prototype._winningSide = null;

Battle.prototype._rounds = null;

Battle.prototype.start = function() {
    var self = this;

    if (!self._rounds) {
        self._rounds = [];
    }

    while (!self._getWinningSide()) {
        self.nextRound();
    }
};

Battle.prototype.nextRound = function() {
    var self        = this,
        winningSide = self._getWinningSide(),
        round;

    if (winningSide) {
        return;
    }

    self.currentRoundNumber++;

    round = self._createNextRound();
    round.setupQueue();
    round.executeQueue();

    console.log('\nRound ', self.currentRoundNumber);
    console.log('LEFT  :');
    console.log(self.leftFormation.toString());
    console.log('RIGHT :');
    console.log(self.rightFormation.toString());
};

Battle.prototype._createNextRound = function() {
    var self = this,
        round;

    round = new Round({
        roundNumber: self.currentRoundNumber,
        leftFormation: self.leftFormation,
        rightFormation: self.rightFormation
    });

    if (self._rounds) {
        self._rounds.push(round);
    }

    return round;
};

Battle.prototype._getWinningSide = function() {
    var self = this,
        isLeftAlive,
        isRightAlive;

    if (self._winningSide) {
        return self._winningSide;
    }

    isLeftAlive  = self.leftFormation.areSomeAlive();
    isRightAlive = self.rightFormation.areSomeAlive();

    if (isLeftAlive && isRightAlive) {
        return null;
    }

    if (isLeftAlive) {
        self._winningSide = BaseUnit.SIDE_LEFT;
    } else if (isRightAlive) {
        self._winningSide = BaseUnit.SIDE_RIGHT;
    }

    return self._winningSide;
};

module.exports = Battle;