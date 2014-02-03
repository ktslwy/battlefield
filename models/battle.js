'use strict';

var BaseUnit    = require('./base-unit'),
    Round       = require('./round');

function Battle(config) {
    var self = this;

    if (config) {
        self._leftFormation  = config.leftFormation;
        self._rightFormation = config.rightFormation;
    }

    if (self._leftFormation) {
        self._leftFormation.setSide(BaseUnit.SIDE_LEFT);
    }

    if (self._rightFormation) {
        self._rightFormation.setSide(BaseUnit.SIDE_RIGHT);
    }
}

Battle.prototype.currentRoundNumber = 0;

Battle.prototype.startState = null;

Battle.prototype.endState = null;

Battle.prototype._leftFormation = null;

Battle.prototype._rightFormation = null;

Battle.prototype.winningSide = null;

Battle.prototype.rounds = null;

Battle.prototype.start = function() {
    var self = this;

    self.startState = {
        leftFormation: self._leftFormation.getData(),
        rightFormation: self._rightFormation.getData()
    };

    if (!self.rounds) {
        self.rounds = [];
    }

    while (!self._getWinningSide()) {
        self.nextRound();
    }

    self.endState = {
        leftFormation: self._leftFormation.getData(),
        rightFormation: self._rightFormation.getData()
    };

    self._finalize();
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
};

Battle.prototype._createNextRound = function() {
    var self = this,
        round;

    round = new Round({
        roundNumber: self.currentRoundNumber,
        leftFormation: self._leftFormation,
        rightFormation: self._rightFormation
    });

    if (self.rounds) {
        self.rounds.push(round);
    }

    return round;
};

Battle.prototype._getWinningSide = function() {
    var self = this,
        isLeftAlive,
        isRightAlive;

    if (self.winningSide) {
        return self.winningSide;
    }

    isLeftAlive  = self._leftFormation.areSomeAlive();
    isRightAlive = self._rightFormation.areSomeAlive();

    if (isLeftAlive && isRightAlive) {
        return null;
    }

    if (isLeftAlive) {
        self.winningSide = BaseUnit.SIDE_LEFT;
    } else if (isRightAlive) {
        self.winningSide = BaseUnit.SIDE_RIGHT;
    }

    return self.winningSide;
};

Battle.prototype._finalize = function() {
    var self = this;

    delete self._leftFormation;
    delete self._rightFormation;
};

module.exports = Battle;