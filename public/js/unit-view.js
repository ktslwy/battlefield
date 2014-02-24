/*jshint browser:true*/
/*globals createjs*/

YUI.add('battlefield-unit-view', function (Y) {
    'use strict';

    var fullRedFilter   = new createjs.ColorFilter(1, 0.5, 0.5, 1),
        halfRedFilter   = new createjs.ColorFilter(1, 0, 0, 1),
        darkFilter      = new createjs.ColorFilter(0.2, 0, 0, 1);

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

    UnitView.prototype.render = function(callback) {
        var self            = this,
            unitData        = self.config.unitData,
            slotContainer   = self.config.slotContainer,
            side            = unitData.side,
            unitSpriteSheet = Y.Battlefield.SpriteSheets[unitData.name][getOppositeSide(side)],
            unitSprite      = new createjs.Sprite(unitSpriteSheet, 'init'),
            slotBounds      = slotContainer.getBounds(),
            unitBounds      = unitSprite.getBounds(),
            initDelay       = Math.random()*1000;

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
        setTimeout(function(){
            unitSprite.gotoAndPlay('stand');
            self._renderStats();
            callback();
        }, initDelay);

        self.unitSprite = unitSprite;
    };

    UnitView.prototype._renderStats = function() {
        var self            = this,
            unitData        = self.config.unitData,
            slotContainer   = self.config.slotContainer,
            slotBounds      = slotContainer.getBounds(),
            hpValue         = unitData.stats.healthPoint,
            hpText          = new createjs.Text(hpValue + '/' + hpValue, 'normal 10px monospace', '#66FF66'),
            hpTextBounds    = hpText.getBounds();

        hpText.x = slotBounds.width - hpTextBounds.width - 5;
        hpText.y = 5;
        slotContainer.addChild(hpText);

        self.hpText = hpText;
    };

    UnitView.prototype.renderAction = function(option, callback) {
        var self        = this,
            role        = option.role;

        if (role === 'source') {
            self._renderActionSource(option, callback);
        } else {
            self._renderActionTarget(option, callback);
        }
    };

    UnitView.prototype._renderActionSource = function(option, callback) {
        var self        = this,
            unitSprite  = self.unitSprite,
            listener;

        listener = unitSprite.on('animationend', function(){
            unitSprite.off('animationend', listener);
            unitSprite.gotoAndPlay('stand');
            callback();
        });
        unitSprite.gotoAndPlay('fire');
    };

    UnitView.prototype._renderActionTarget = function(option, callback) {
        var self            = this,
            effect          = option.effects && option.effects[0],
            hpText          = self.hpText,
            unitData        = self.config.unitData,
            unitSprite      = self.unitSprite,
            slotContainer   = self.config.slotContainer,
            hpValue;

        unitData.stats.healthPoint += effect.change;
        hpValue = unitData.stats.healthPoint;
        hpText.text = hpText.text.replace(/^\s?\d+/, hpValue < 10 ? (' ' + hpValue) : hpValue);
        self._renderDamage(null, function(){
            if (hpValue === 0) {
                slotContainer.visible = false;
                unitSprite.stop();
            }
            callback();
        });
    };

    UnitView.prototype._renderDamage = function(changes, callback) {
        var self            = this,
            unitSprite      = self.unitSprite,
            slotContainer   = self.config.slotContainer,
            slotBackground  = slotContainer.getChildByName('slot-background'),
            slotBounds      = slotContainer.getBounds(),
            change,
            filter;

        if (!changes) {
            changes = [
                { x: unitSprite.x-5, y: unitSprite.y  , alpha: 0.8, filters: [fullRedFilter] },
                { x: unitSprite.x  , y: unitSprite.y-5, alpha: 0.6, filters: [halfRedFilter] },
                { x: unitSprite.x+5, y: unitSprite.y  , alpha: 0.7, filters: [fullRedFilter] },
                { x: unitSprite.x  , y: unitSprite.y+5, alpha: 0.9, filters: [halfRedFilter] },
                { x: unitSprite.x  , y: unitSprite.y  , alpha: 1  , filters: [] }
            ];
            slotBackground.cache(0, 0, slotBounds.width, slotBounds.height);
            self._renderDamage(changes, callback);
        } else {
            change = changes.splice(0, 1)[0];

            if (change) {
                unitSprite.x = change.x;
                unitSprite.y = change.y;
                unitSprite.alpha = change.alpha;
                slotBackground.filters = change.filters;
                slotBackground.updateCache();
                setTimeout(self._renderDamage.bind(self, changes, callback), 1000/12);
            } else {
                callback();
            }
        }
    };

    Y.namespace('Battlefield').UnitView = UnitView;

}, '0.0.0', {requires: []});