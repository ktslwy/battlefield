/*jshint browser:true*/
/*globals createjs*/

YUI.add('battlefield-side-view', function (Y) {
    'use strict';

    var APP_CONFIG      = Y.AppConfig,
        SLOT_SIZE       = APP_CONFIG.slotSize,
        SLOT_GRAPHIC    = new createjs.Graphics(),
        ROWS            = 5,
        COLUMNS         = 5,
        SLOT_HIGHLIGHTS = {
            'true'  : 0.5,
            'false' : 0.25
        };

    SLOT_GRAPHIC.beginFill('#ffffff').drawRoundRectComplex(0, 0, SLOT_SIZE.width, SLOT_SIZE.height, 10, 10, 10, 10).endFill();

    function SideView(config) {
        var self = this;

        self.config = config;
    }

    SideView.prototype.get = function(key) {
        var self            = this,
            config          = self.config,
            formationData   = config.formationData;

        if (key === 'units') {
            return formationData && formationData.formation;
        }

        return self.config[key] || self[key];
    };

    SideView.prototype.render = function(callback) {
        var self = this;

        self._renderSlots();
        self._renderUnitViews(callback);
    };

    SideView.prototype._renderSlots = function() {
        var self            = this,
            side            = self.get('side'),
            sideContainer   = self.get('container'),
            containerBounds = sideContainer.getBounds(),
            slotContainers  = [],
            spacing         = self._computeSlotSpacing(),
            slotPositionX   = 0,
            slotPositionY   = 0,
            slotIndex       = 0,
            rowCount, columnCount, slotContainer;

        for (rowCount=0; rowCount<ROWS; rowCount++) {
            slotPositionY += spacing;
            slotPositionX = side === 'left' ? 0 : containerBounds.width;
            for (columnCount=0; columnCount<COLUMNS; columnCount++) {
                slotPositionX = side === 'left' ? (slotPositionX + spacing) : (slotPositionX - spacing - SLOT_SIZE.width);
                slotContainer = self._createSlotContainer(slotIndex + 1, slotPositionX, slotPositionY);
                slotContainers[slotIndex] = slotContainer;
                sideContainer.addChild(slotContainer);
                slotPositionX = side === 'left' ? (slotPositionX + SLOT_SIZE.width) : slotPositionX;
                slotIndex++;
            }
            slotPositionY += SLOT_SIZE.height;
        }

        self._slotContainers = slotContainers;
    };

    SideView.prototype._computeSlotSpacing = function() {
        var self            = this,
            containerBounds = self.get('container').getBounds(),
            totalSlotHeight = ROWS * SLOT_SIZE.height,
            totalSpacing    = containerBounds.height - totalSlotHeight,
            spacing         = totalSpacing / (ROWS + 1); // + 1 to include bottom border spacing

        return spacing;
    };

    SideView.prototype._createSlotContainer = function(index, x, y) {
        var slotContainer   = new createjs.Container(),
            slotShape       = new createjs.Shape(SLOT_GRAPHIC),
            slotIndexText   = new createjs.Text(index, 'bold 11px monospace', '#000');

        slotContainer.x = x;
        slotContainer.y = y;
        slotContainer.setBounds(x, y, SLOT_SIZE.width, SLOT_SIZE.height);
        slotContainer.slotIndex = index;

        slotShape.x = 0;
        slotShape.y = 0;
        slotShape.alpha = 0.25;
        slotShape.name = 'slot-background';
        slotContainer.addChild(slotShape);

        slotIndexText.x = 5;
        slotIndexText.y = 5;
        slotContainer.addChild(slotIndexText);

        return slotContainer;
    };

    SideView.prototype._renderUnitViewAt = function(position) {
        var self            = this,
            slotContainers  = self._slotContainers,
            unitView        = self._getUnitViewAt(position),
            unitData        = self.getUnitDataAt(position);

        if (unitView) {
            unitView.updateUnitData(unitData);
        } else {
            unitView = new Y.Battlefield.UnitView({
                unitData        : unitData,
                slotContainer   : slotContainers[position - 1],
                isEditMode      : self.get('isEditMode')
            });
            unitView.render();
            self._unitViews.push(unitView);
        }
    };

    SideView.prototype._renderUnitViews = function(callback) {
        var self            = this,
            slotContainers  = self._slotContainers,
            isEditMode      = self.get('isEditMode'),
            units           = self.get('units'),
            unitViews       = [];

        self._unitViewsRenderedCallback = callback;
        self._unitViewsRendered = [];

        if (units.length > 0) {
            Y.Array.forEach(units, function(unitData, i){
                var unitView = new Y.Battlefield.UnitView({
                    unitData        : unitData,
                    slotContainer   : slotContainers[unitData.position - 1],
                    isEditMode      : isEditMode
                });

                unitView.render(self._handleUnitViewsRendered.bind(self, i));
                unitViews[i] = unitView;
            });
        } else {
            setTimeout(callback, 0);
        }

        self._unitViews = unitViews;

        if (!isEditMode) {
            Y.each(slotContainers, function(slotContainer, i){
                if (!self._getUnitViewAt(i+1)) {
                    slotContainer.visible = false;
                }
            });
        }
    };

    SideView.prototype._handleUnitViewsRendered = function(i) {
        var self                = this,
            unitViews           = self._unitViews,
            unitViewsRendered   = self._unitViewsRendered;

        unitViewsRendered[i] = true;

        if (Y.Array.every(unitViews, function(unitView, i){ return !!unitViewsRendered[i]; })) {
            self._unitViewsRenderedCallback();
        }
    };

    SideView.prototype.renderAction = function(option, callback) {
        var self        = this,
            action      = option.action,
            role        = option.role,
            effects     = action.effects,
            unitPos     = action[role].position,
            unitView    = self._getUnitViewAt(unitPos);

        if (role === 'source') {
            unitView.renderAction({ role: role }, callback);
        } else if (role === 'target') {
            unitView.renderAction({ role: role, effects: effects }, callback);
        }
    };

    SideView.prototype._getUnitViewAt = function(position) {
        var self        = this,
            unitViews   = self._unitViews;

        return Y.Array.find(unitViews, function(unitView){
            return unitView.get('unitPosition') === position;
        });
    };

    SideView.prototype.getUnitDataAt = function(position) {
        var self    = this,
            units   = self.get('units');

        return Y.Array.find(units, function(unit){
            return unit.position === position;
        });
    };

    SideView.prototype.getPositionByXY = function(x, y) {
        var self            = this,
            slotContainer   = self._getSlotContainerAt(x, y);
        return slotContainer ? slotContainer.slotIndex : undefined;
    };

    SideView.prototype._getSlotContainerAt = function(x, y) {
        var self            = this,
            container       = self.get('container'),
            containerBounds = container.getBounds(),
            slotContainers  = self._slotContainers;

        if (x < 0 || x > containerBounds.width || y < 0 || y > containerBounds.height) {
            return null;
        }

        return Y.Array.find(slotContainers, function(slotContainer){
            var bounds = slotContainer.getBounds();
            return x > bounds.x && x < (bounds.x + bounds.width) && y > bounds.y && y < (bounds.y + bounds.height);
        });
    };

    SideView.prototype.updateFormationData = function(changes) {
        var self    = this,
            units   = self.get('units'),
            updates = changes.updates,
            removes = changes.removes;

        Y.each(removes, function(removePosition) {
            var currentUnitData = self.getUnitDataAt(removePosition);

            if (currentUnitData) {
                units.splice(units.indexOf(currentUnitData), 1);
            }

            self._renderUnitViewAt(removePosition);
        });

        Y.each(updates, function(updatedUnitData) {
            var updatePosition    = updatedUnitData.position,
                currentUnitData = self.getUnitDataAt(updatePosition);

            if (currentUnitData) {
                units[units.indexOf(currentUnitData)] = updatedUnitData;
            } else {
                units.push(updatedUnitData);
            }

            self._renderUnitViewAt(updatePosition);
        });
    };

    SideView.prototype.toggleHighlightAt = function(x, y, isThisHighlight, areOthersHighlight) {
        var self                = this,
            thisSlotContainer   = self._getSlotContainerAt(x, y);

        if (areOthersHighlight === undefined) {
            if (thisSlotContainer) {
                thisSlotContainer.getChildByName('slot-background').alpha = SLOT_HIGHLIGHTS[(!!isThisHighlight).toString()];
            }
        } else {
            Y.each(self._slotContainers, function(slotContainer){
                var slotBackground  = slotContainer.getChildByName('slot-background'),
                    highlightKey    = slotContainer === thisSlotContainer ? (!!isThisHighlight).toString() : (!!areOthersHighlight).toString(),
                    highlightAlpha  = SLOT_HIGHLIGHTS[highlightKey];

                if (slotBackground.alpha !== highlightAlpha) {
                    slotBackground.alpha = highlightAlpha;
                }
            });
        }
    };

    SideView.prototype.bringPositionToTop = function(position) {
        var self            = this,
            slotContainer   = self._slotContainers[position - 1];

        self.get('container').setChildIndex(slotContainer, 0);
    };

    Y.namespace('Battlefield').SideView = SideView;

}, '0.0.0', {requires: ['battlefield-unit-view']});