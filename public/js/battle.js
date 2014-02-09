YUI.add('battlefield-battle', function (Y) {
    'use strict';

    function Battle(config) {
        var self = this,
            battleStage = config.battleStage;

        self.config = config;

        self.battleView = new Y.Battlefield.BattleView({
            battleStage: battleStage
        });
    }

    Battle.prototype.start = function() {
        var self = this;

        self.battleView.render();
    };

    Y.namespace('Battlefield').Battle = Battle;

}, '0.0.0', {requires: ['battlefield-battle-view']});