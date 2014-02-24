/*jshint browser:true*/
/*globals createjs*/

YUI.add('battlefield-formation-view', function (Y) {
    'use strict';

    var APP_CONFIG  = Y.AppConfig,
        UNIT_CONFIG = Y.UnitConfig;

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
            lastHighlightedSlot;

        canvasNode.on('dragover', function(e){
            if (e.preventDefault) {
                e.preventDefault();
            }

            if (lastExecutedDragOver + dragOverExecuteInterval > Date.now()) {
                return;
            }
            lastExecutedDragOver = Date.now();

            var nativeEvent = e._event,
                mouseXY     = { x: nativeEvent.layerX, y: nativeEvent.layerY },
                slotContainer;

            slotContainer = sideView.getSlotContainerAt(mouseXY.x, mouseXY.y);

            if (slotContainer !== lastHighlightedSlot) {
                if (lastHighlightedSlot) {
                    lastHighlightedSlot.getChildByName('slot-background').alpha = 0.25;
                }
                lastHighlightedSlot = slotContainer;
                if (slotContainer) {
                    slotContainer.getChildByName('slot-background').alpha = 0.5;
                }
                nativeEvent.dataTransfer.dropEffect = 'move';
            }
        });

        canvasNode.on(['dragleave', 'drop'], function(e){
            if (lastHighlightedSlot) {
                lastHighlightedSlot.getChildByName('slot-background').alpha = 0.25;
            }
        });

        canvasNode.on('drop', function(e){
            var nativeEvent = e._event,
                unitName    = nativeEvent.dataTransfer.getData('unitName'),
                targetSlot  = lastHighlightedSlot,
                unitData;

            Y.each(UNIT_CONFIG, function(unitConfig) {
                if (unitConfig.name === unitName) {
                    unitData = Y.clone(unitConfig);
                }
            });

            unitData.side = 'right';
            unitData.position = targetSlot.parent.getChildIndex(targetSlot) + 1;

            sideView.updateFormationData({
                updates: [ unitData ]
            });
        });
    };

    Y.namespace('Battlefield').FormationView = FormationView;

}, '0.0.0', {requires: ['battlefield-side-view']});