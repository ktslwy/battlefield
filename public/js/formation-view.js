/*jshint browser:true*/
/*globals createjs*/

YUI.add('battlefield-formation-view', function (Y) {
    'use strict';

    var APP_CONFIG  = Y.AppConfig,
        UNIT_CONFIG = Y.UnitConfig;

    function getEventOffset(e) {
        if (e.offsetX !== undefined && e.offsetY !== undefined) {
            return {x: e.offsetX, y:e.offsetY};
        }

        var node    = e.target,
            offset  = {x: 0, y: 0};

        while (node.offsetParent) {
            offset.x += node.offsetLeft;
            offset.y += node.offsetTop;
            node = node.offsetParent;
        }

        offset.x = e.pageX - offset.x;
        offset.y = e.pageY - offset.y;

        return offset;
    }

    function FormationView(config) {
        var self = this;

        self.config = config;
    }

    FormationView.prototype.render = function() {
        var self = this;

        self._renderBackground();
        self._renderSide();
        self._initDragEvents();
    };

    FormationView.prototype._renderBackground = function() {
        var self            = this,
            assets          = Y.Battlefield.Assets,
            formationStage  = self.config.formationStage,
            canvas          = formationStage.canvas,
            backgroundShape = new createjs.Shape();

        backgroundShape.x = 0;
        backgroundShape.y = 0;
        backgroundShape.graphics.beginBitmapFill(assets.BackgroundTexture,'repeat').drawRect(0, 0, canvas.width, canvas.height);
        formationStage.addChild(backgroundShape);

        self.backgroundShape = backgroundShape;
    };

    FormationView.prototype._renderSide = function() {
        var self            = this,
            formationStage  = self.config.formationStage,
            sideContainer   = self._getSideContainer(),
            sideView;

        formationStage.addChild(sideContainer);

        sideView = new Y.Battlefield.SideView({
            side            : 'right',
            formationData   : { formation: [] },
            container       : sideContainer,
            hideEmptySlots  : false
        });

        sideView.render();

        self.sideView = sideView;
        self.sideContainer = sideContainer;
    };

    FormationView.prototype._getSideContainer = function() {
        var self            = this,
            formationStage  = self.config.formationStage,
            canvas          = formationStage.canvas,
            sideContainer   = new createjs.Container();

        sideContainer.x = 0;
        sideContainer.y = 0;
        sideContainer.setBounds(0, 0, canvas.width, canvas.height);

        return sideContainer;
    };

    FormationView.prototype._initDragEvents = function() {
        var self                    = this,
            formationStage          = self.config.formationStage,
            sideView                = self.sideView,
            sideContainer           = self.sideContainer,
            canvasNode              = Y.one(formationStage.canvas),
            lastExecutedDragOver    = 0,
            dragOverExecuteInterval = 20,
            mouseDownSlot;

        formationStage.enableMouseOver(dragOverExecuteInterval);

        // enter the canvas for drag starting from outside ofthe canvas
        canvasNode.on('dragover', function(e){
            if (e.preventDefault) {
                e.preventDefault();
            }

            if (lastExecutedDragOver + dragOverExecuteInterval > Date.now()) {
                return;
            }
            lastExecutedDragOver = Date.now();

            var nativeEvent = e._event,
                mouseXY     = getEventOffset(nativeEvent),
                slotContainer;

            self._handleMouseOverAt(mouseXY.x, mouseXY.y);

            if (slotContainer !== self._lastHighlightedSlot) {
                nativeEvent.dataTransfer.dropEffect = 'move';
            }
        });

        // leave the canvas for drag starting from outside the canvas
        canvasNode.on('dragleave', function(e){
            self._toggleSlotHighlight(self._lastHighlightedSlot, false);
        });

        // drop inside the canvas for drag starting from outside the canvas
        canvasNode.on('drop', function(e){
            var nativeEvent = e._event,
                unitName    = nativeEvent.dataTransfer.getData('unitName'),
                targetSlot  = self._lastHighlightedSlot,
                unitData;

            Y.each(UNIT_CONFIG, function(unitConfig) {
                if (unitConfig.name === unitName) {
                    unitData = Y.clone(unitConfig);
                }
            });

            unitData.side = 'right';
            unitData.position = targetSlot.slotIndex;

            sideView.updateFormationData({
                updates: [ unitData ]
            });
        });

        // mouse over in the canvas when not dragging
        formationStage.on('mouseover', function(e){
            self._handleMouseOverAt(e.stageX, e.stageY);
        });

        // leave the canvas when not dragging
        formationStage.on('rollout', function(e){
            self._toggleSlotHighlight(self._lastHighlightedSlot, false);
        });

        // press on the canvas when not dragging
        formationStage.on('mousedown', function(e){
            var unit = e.target;

            if (unit.name === 'unit') {
                unit.offset = {x: e.stageX, y: e.stageY};
                mouseDownSlot = sideView.getSlotContainerAt(e.stageX, e.stageY);
                sideContainer.setChildIndex(mouseDownSlot, 0);
            }
        });

        // drag inside the canvas for drag starting from inside the canvas
        formationStage.on('pressmove', function(e){
            var unit = e.target;

            if (unit.name === 'unit') {
                unit.x = unit.x + e.stageX - unit.offset.x;
                unit.y = unit.y + e.stageY - unit.offset.y;
                unit.offset = {x: e.stageX, y: e.stageY};
            }
        });

        formationStage.on('pressup', function(e){
            var unit = e.target,
                unitData,
                targetSlot;

            if (unit.name === 'unit' || mouseDownSlot) {
                targetSlot = sideView.getSlotContainerAt(e.stageX, e.stageY);
                unitData = sideView.getUnitViewByPos(mouseDownSlot.slotIndex).config.unitData;

                if (targetSlot) {
                    sideView.updateFormationData({
                        removes: [ mouseDownSlot.slotIndex ]
                    });
                    unitData.position = targetSlot.slotIndex;
                }

                sideView.updateFormationData({
                    updates: [ unitData ]
                });

                mouseDownSlot = undefined;
            }
        });
    };

    FormationView.prototype._handleMouseOverAt = function(x, y) {
        var self            = this,
            slotContainer   = self.sideView.getSlotContainerAt(x, y);

        if (slotContainer !== self._lastHighlightedSlot) {
            if (self._lastHighlightedSlot) {
                self._toggleSlotHighlight(self._lastHighlightedSlot, false);
            }
            self._lastHighlightedSlot = slotContainer;
            if (slotContainer) {
                self._toggleSlotHighlight(slotContainer, true);
            }
        }
    };

    FormationView.prototype._toggleSlotHighlight = function(slot, isHighlight) {
        if (slot) {
            slot.getChildByName('slot-background').alpha = isHighlight ? 0.5 : 0.25;
        }
    };

    FormationView.prototype.getFormationData = function() {
        var self = this;

        return self.sideView.config.formationData;
    };

    Y.namespace('Battlefield').FormationView = FormationView;

}, '0.0.0', {requires: ['battlefield-side-view']});