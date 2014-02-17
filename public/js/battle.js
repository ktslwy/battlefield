YUI.add('battlefield-battle', function (Y) {
    'use strict';

    function Battle(config) {
        var self = this,
            battleStage = config.battleStage,
            battleData = config.battleData;

        self.config = config;

        self.battleView = new Y.Battlefield.BattleView({
            battleStage: battleStage,
            battleStartState: battleData.startState
        });
    }

    Battle.prototype.start = function() {
        var self = this;

        self.battleView.render(function(){
            self._executeRound();
        });
    };

    Battle.prototype._executeRound = function(roundNumber) {
        roundNumber = roundNumber || 1;

        var self        = this,
            battleView  = self.battleView,
            battleData  = self.config.battleData,
            roundData   = battleData.rounds[roundNumber-1];

        if (!roundData) {
            return;
        }

        battleView.renderRound(roundData, function(){
            console.log('finished rendering round ' + roundNumber);
            self._executeRound(roundNumber + 1);
        });
    };

    Y.namespace('Battlefield').Battle = Battle;

}, '0.0.0', {requires: ['battlefield-battle-view']});