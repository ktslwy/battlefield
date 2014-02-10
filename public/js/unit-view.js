/*jshint browser:true*/
/*globals createjs*/

YUI.add('battlefield-unit-view', function (Y) {
    'use strict';

    function UnitView(config) {
        var self = this;

        self.config = config;
    }

    UnitView.prototype.render = function() {
        var self            = this,
            unitData        = self.config.unitData,
            slotContainer   = self.config.slotContainer,
            unitSpriteSheet = Y.Battlefield.SpriteSheets[unitData.name],
            unitSprite      = new createjs.Sprite(unitSpriteSheet, 'init'),
            slotBounds      = slotContainer.getBounds(),
            unitBounds      = unitSprite.getBounds();

        unitSprite.x = slotBounds.width - unitBounds.width - 5;
        unitSprite.y = slotBounds.height - unitBounds.height - 5;

        slotContainer.addChild(unitSprite);
        setTimeout(function(){unitSprite.gotoAndPlay('stand');}, Math.random()*1000);
    };

    Y.namespace('Battlefield').UnitView = UnitView;

}, '0.0.0', {requires: []});