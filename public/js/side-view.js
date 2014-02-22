/*jshint browser:true*/
/*globals createjs*/

YUI.add('battlefield-side-view', function (Y) {
    'use strict';

    var APP_CONFIG      = Y.AppConfig,
        SLOT_SIZE       = APP_CONFIG.slotSize,
        SLOT_GRAPHIC    = new createjs.Graphics(),
        ROWS            = 5,
        COLUMNS         = 5;

    SLOT_GRAPHIC.beginFill('#ffffff').drawRoundRectComplex(0, 0, SLOT_SIZE.width, SLOT_SIZE.height, 10, 10, 10, 10).endFill();

    function SideView(config) {
        var self = this;

        self.config = config;
    }

    SideView.prototype.render = function(callback) {
        var self = this;

        self._renderSlots();
        self._renderUnitViews(callback);
    };

    SideView.prototype._renderSlots = function() {
        var self            = this,
            side            = self.config.side,
            sideContainer   = self.config.container,
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
                slotContainer = self._getSlotContainer(slotIndex + 1, slotPositionX, slotPositionY);
                slotContainers[slotIndex] = slotContainer;
                sideContainer.addChild(slotContainer);
                slotPositionX = side === 'left' ? (slotPositionX + SLOT_SIZE.width) : slotPositionX;
                slotIndex++;
            }
            slotPositionY += SLOT_SIZE.height;
        }

        self.slotContainers = slotContainers;
    };

    SideView.prototype._computeSlotSpacing = function() {
        var self            = this,
            containerBounds = self.config.container.getBounds(),
            totalSlotHeight = ROWS * SLOT_SIZE.height,
            totalSpacing    = containerBounds.height - totalSlotHeight,
            spacing         = totalSpacing / (ROWS + 1); // + 1 to include bottom border spacing

        return spacing;
    };

    SideView.prototype._getSlotContainer = function(index, x, y) {
        var slotContainer   = new createjs.Container(),
            slotShape       = new createjs.Shape(SLOT_GRAPHIC),
            slotIndexText   = new createjs.Text(index, 'bold 11px monospace', '#000');

        slotContainer.x = x;
        slotContainer.y = y;
        slotContainer.setBounds(x, y, SLOT_SIZE.width, SLOT_SIZE.height);

        slotShape.x = 0;
        slotShape.y = 0;
        slotShape.alpha = 0.25;
        slotShape.name = 'background';
        slotContainer.addChild(slotShape);

        slotIndexText.x = 5;
        slotIndexText.y = 5;
        slotContainer.addChild(slotIndexText);

        return slotContainer;
    };

    SideView.prototype._renderUnitViews = function(callback) {
        var self            = this,
            slotContainers  = self.slotContainers,
            units           = self.config.formationData.formation,
            unitViews       = [];

        self._unitViewsRenderedCallback = callback;
        self._unitViewsRendered = [];

        Y.Array.forEach(units, function(unitData, i){
            var unitView = new Y.Battlefield.UnitView({
                unitData        : unitData,
                slotContainer   : slotContainers[unitData.position - 1]
            });

            unitView.render(self._handleUnitViewsRendered.bind(self, i));
            unitViews[i] = unitView;
        });

        self.unitViews = unitViews;

        Y.each(slotContainers, function(slotContainer, i){
            if (!self._getUnitViewByPos(i+1)) {
                slotContainer.visible = false;
            }
        });
    };

    SideView.prototype._handleUnitViewsRendered = function(i) {
        var self                = this,
            unitViews           = self.unitViews,
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
            unitView    = self._getUnitViewByPos(unitPos);

        if (role === 'source') {
            unitView.renderAction({ role: role }, callback);
        } else if (role === 'target') {
            unitView.renderAction({ role: role, effects: effects }, callback);
        }
    };

    SideView.prototype._getUnitViewByPos = function(pos) {
        var self        = this,
            unitViews   = self.unitViews,
            foundUnitView;

        Y.Array.some(unitViews, function(unitView){
            if (unitView.config.unitData.position === pos) {
                foundUnitView = unitView;
                return true;
            }
            return false;
        });

        return foundUnitView;
    };

    Y.namespace('Battlefield').SideView = SideView;

}, '0.0.0', {requires: ['battlefield-unit-view']});