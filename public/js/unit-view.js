/*jshint browser:true*/
/*globals createjs*/

YUI.add('battlefield-unit-view', function (Y) {
    'use strict';

    function getOppositeSide(side) {
        if (side === 'left') {
            return 'right';
        } else if (side === 'right') {
            return 'left';
        }
    }

    function UnitView(config) {
        var self = this;

        self.config = config;
    }

    UnitView.prototype.render = function() {
        var self            = this,
            unitData        = self.config.unitData,
            slotContainer   = self.config.slotContainer,
            side            = unitData.side,
            unitSpriteSheet = Y.Battlefield.SpriteSheets[unitData.name][getOppositeSide(side)],
            unitSprite      = new createjs.Sprite(unitSpriteSheet, 'init'),
            slotBounds      = slotContainer.getBounds(),
            unitBounds      = unitSprite.getBounds();

        // by default, slot and sprite are left and top aligned at x=0, y=0
        if (side === 'right') {
            // align right then have 5px from the right
            unitSprite.x = slotBounds.width - unitBounds.width - 5;
        } else {
            // have 5 px from the left
            unitSprite.x = 5;
        }
        // // align bottom then have 5 px from the bottom
        unitSprite.y = slotBounds.height - unitBounds.height - 5;

        slotContainer.addChild(unitSprite);
        setTimeout(function(){unitSprite.gotoAndPlay('stand');}, Math.random()*1000);
    };

    Y.namespace('Battlefield').UnitView = UnitView;

}, '0.0.0', {requires: []});