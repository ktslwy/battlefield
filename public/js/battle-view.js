/*jshint browser:true*/
/*globals createjs*/

YUI.add('battlefield-battle-view', function (Y) {
    'use strict';

    function BattleView(config) {
        var self = this;

        self.config = config;
    }

    BattleView.prototype.render = function() {
        var self = this,
            assets = Y.Battlefield.Assets,
            battleStage = self.config.battleStage,
            backgroundShape = new createjs.Shape();

        self.backgroundShape = backgroundShape;

        backgroundShape.x = 0;
        backgroundShape.y = 0;
        battleStage.addChild(backgroundShape);
        backgroundShape.graphics.beginBitmapFill(assets.backgroundTexture,'repeat').drawRect(0, 0, 960, 480);
    };

    Y.namespace('Battlefield').BattleView = BattleView;

}, '0.0.0', {requires: []});