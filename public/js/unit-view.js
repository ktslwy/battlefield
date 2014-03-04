/*jshint browser:true*/
/*globals createjs*/

YUI.add('battlefield-unit-view', function (Y) {
    'use strict';

    var fullRedFilter   = new createjs.ColorFilter(1, 0.5, 0.5, 1),
        halfRedFilter   = new createjs.ColorFilter(1, 0, 0, 1);

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
        self._displayObjects = {};
    }

    UnitView.prototype.get = function(key) {
        var self        = this,
            config      = self.config,
            unitData    = config.unitData;

        if (key === 'unitPosition') {
            return unitData && unitData.position;
        }

        if (key === 'bounds') {
            return self.get('slotContainer').getBounds();
        }

        return self.config[key] || self[key];
    };

    UnitView.prototype.getDisplayObject = function(key) {
        return this._displayObjects[key];
    };

    UnitView.prototype._setDisplayObject = function(key, value) {
        this._displayObjects[key] = value;
    };

    UnitView.prototype._removeDisplayObject = function(key) {
        var object = this._displayObjects[key];

        if (object) {
            if (typeof object.stop === 'function') {
                object.stop();
            }
            object.parent.removeChild(object);
            delete this._displayObjects[key];
        }
    };

    UnitView.prototype.render = function(callback) {
        var self        = this,
            isEditMode  = self.get('isEditMode'),
            initDelay   = isEditMode ? false : (Math.random()*1000);

        self._renderUnit();

        setTimeout(function(){
            var unitSprite = self.getDisplayObject('unitSprite');

            self._renderStats();
            if (unitSprite) {
                unitSprite.gotoAndPlay('stand');
            }
            if (typeof callback === 'function') {
                callback();
            }
        }, initDelay);

        if (isEditMode) {
            self._renderRemoveControl();
        }
    };

    UnitView.prototype._renderUnit = function() {
        var self            = this,
            unitData        = self.get('unitData'),
            slotContainer   = self.get('slotContainer'),
            side            = unitData.side,
            unitSpriteSheet = Y.Battlefield.SpriteSheets[unitData.name][getOppositeSide(side)],
            unitSprite      = new createjs.Sprite(unitSpriteSheet, 'init'),
            slotBounds      = slotContainer.getBounds(),
            unitBounds      = unitSprite.getBounds();

        // by default, slot and sprite are left and top aligned at x=0, y=0
        if (side === 'right') {
            // align right then have 8px from the right
            unitSprite.x = slotBounds.width - unitBounds.width - 8;
        } else {
            // have 8 px from the left
            unitSprite.x = 8;
        }
        // align bottom then have 5 px from the bottom
        unitSprite.y = slotBounds.height - unitBounds.height - 5;
        unitSprite.name = 'unit';
        unitSprite.shadow = new createjs.Shadow("#000000", side === 'left' ? -3 : 3, 0, 10);
        slotContainer.addChild(unitSprite);

        self._setDisplayObject('unitSprite', unitSprite);
    };

    UnitView.prototype._renderStats = function() {
        var self            = this,
            unitData        = self.get('unitData'),
            slotContainer   = self.get('slotContainer'),
            slotBounds      = slotContainer.getBounds(),
            hpValue         = unitData.stats.healthPoint,
            hpText          = self.getDisplayObject('hpText'),
            hpTextBounds;

        if (hpText) {
            hpText.text = hpValue + '/' + hpValue;
        } else {
            hpText = new createjs.Text(hpValue + '/' + hpValue, 'normal 10px monospace', '#66FF66');
            slotContainer.addChild(hpText);
            self._setDisplayObject('hpText', hpText);
        }

        hpTextBounds = hpText.getBounds();
        hpText.x = slotBounds.width - hpTextBounds.width - 5;
        hpText.y = 5;
    };

    UnitView.prototype._renderRemoveControl = function() {
        var self            = this,
            removeControl   = self.getDisplayObject('removeControl'),
            slotContainer   = self.get('slotContainer'),
            slotBounds;

        if (removeControl) {
            return;
        }

        slotBounds = slotContainer.getBounds();

        removeControl = new createjs.Text('DEL', 'bold 10px monospace', 'red');
        removeControl.name = 'remove';
        removeControl.x = 5;
        removeControl.y = slotBounds.height - 15;
        removeControl.visible = false;
        slotContainer.addChild(removeControl);

        self._setDisplayObject('removeControl', removeControl);
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
            unitSprite  = self.getDisplayObject('unitSprite'),
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
            unitData        = self.get('unitData'),
            slotContainer   = self.get('slotContainer'),
            hpText          = self.getDisplayObject('hpText'),
            unitSprite      = self.getDisplayObject('unitSprite'),
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
            unitSprite      = self.getDisplayObject('unitSprite'),
            slotContainer   = self.get('slotContainer'),
            slotBackground  = slotContainer.getChildByName('slot-background'),
            slotBounds      = slotContainer.getBounds(),
            change;

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

    UnitView.prototype._clean = function() {
        var self = this;

        self._removeDisplayObject('unitSprite');
        self._removeDisplayObject('hpText');
        self._removeDisplayObject('removeControl');
    };

    UnitView.prototype.updateUnitData = function(unitData) {
        var self = this;

        self.config.unitData = unitData;
        self._clean();

        if (unitData) {
            self.render();
        }
    };

    UnitView.prototype.toggleHighlight = function(isHighlight) {
        var self = this,
            removeControl;

        if (self.get('isEditMode')) {
            removeControl = self.getDisplayObject('removeControl');
            removeControl.visible = !!isHighlight;
        }
    };

    Y.namespace('Battlefield').UnitView = UnitView;

}, '0.0.0', {requires: []});