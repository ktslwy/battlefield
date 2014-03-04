/*jshint browser:true*/
/*globals createjs*/

YUI.add('battlefield-formation-view', function (Y) {
    'use strict';

    var UNIT_CONFIG = Y.UnitConfig;

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

    FormationView.prototype.get = function(key) {
        var self = this;

        if (key === 'formation') {
            return self._sideView && self._sideView.get('formationData');
        }

        return self.config[key] || self[key];
    };

    FormationView.prototype.render = function() {
        var self = this;

        self._renderBackground();
        self._renderSide();
        self._initFormationControl();
    };

    FormationView.prototype._renderBackground = function() {
        var self            = this,
            assets          = Y.Battlefield.Assets,
            formationStage  = self.get('formationStage'),
            canvas          = formationStage.canvas,
            backgroundShape = new createjs.Shape();

        backgroundShape.x = 0;
        backgroundShape.y = 0;
        backgroundShape.graphics.beginBitmapFill(assets.BackgroundTexture,'repeat').drawRect(0, 0, canvas.width, canvas.height);
        formationStage.addChild(backgroundShape);

        self._backgroundShape = backgroundShape;
    };

    FormationView.prototype._renderSide = function() {
        var self            = this,
            formationStage  = self.get('formationStage'),
            sideContainer   = self._createSideContainer(),
            sideView;

        formationStage.addChild(sideContainer);

        sideView = new Y.Battlefield.SideView({
            side            : 'right',
            formationData   : { formation: [] },
            container       : sideContainer,
            isEditMode      : true
        });

        sideView.render();

        self._sideView = sideView;
        self._sideContainer = sideContainer;
    };

    FormationView.prototype._createSideContainer = function() {
        var self            = this,
            formationStage  = self.get('formationStage'),
            canvas          = formationStage.canvas,
            sideContainer   = new createjs.Container();

        sideContainer.x = 0;
        sideContainer.y = 0;
        sideContainer.setBounds(0, 0, canvas.width, canvas.height);

        return sideContainer;
    };

    FormationView.prototype._initFormationControl = function() {
        var self                    = this,
            formationStage          = self.get('formationStage'),
            sideView                = self._sideView,
            canvasNode              = Y.one(formationStage.canvas),
            lastExecutedDragOver    = 0,
            dragOverExecuteInterval = 20,
            mouseDownXY;

        formationStage.enableMouseOver(dragOverExecuteInterval);

        // enter the canvas for drag starting from outside ofthe canvas
        canvasNode.on('dragover', function(e){
            e.preventDefault();

            if (lastExecutedDragOver + dragOverExecuteInterval > Date.now()) {
                return;
            }
            lastExecutedDragOver = Date.now();

            var nativeEvent = e._event,
                mouseXY     = getEventOffset(nativeEvent);

            self._handleMouseOverAt(mouseXY.x, mouseXY.y);
        });

        // leave the canvas for drag starting from outside the canvas
        canvasNode.on('dragleave', function(){
            self._handleMouseOverAt(-1, -1);
        });

        // drop inside the canvas for drag starting from outside the canvas
        canvasNode.on('drop', function(e){
            var nativeEvent     = e._event,
                mouseXY         = getEventOffset(nativeEvent),
                unitName        = nativeEvent.dataTransfer.getData('unitName'),
                unitData;

            if (!unitName) {
                return;
            }

            unitData = Y.clone(Y.Array.find(UNIT_CONFIG, function(unitConfig){
                return unitConfig.name === unitName;
            }));

            if (unitData) {
                unitData.side = 'right';
                self._handleDrop(unitData, mouseXY);
            }
        });

        // mouse over in the canvas when not dragging
        formationStage.on('mouseover', function(e){
            self._handleMouseOverAt(e.stageX, e.stageY);
        });

        // leave the canvas when not dragging
        formationStage.on('rollout', function(){
            self._handleMouseOverAt(-1, -1);
        });

        // press on the canvas when not dragging
        formationStage.on('mousedown', function(e){
            var unit = e.target;

            if (unit.name === 'unit') {
                unit.offset = {x: e.stageX, y: e.stageY};
                sideView.bringPositionToTop(sideView.getPositionByXY(e.stageX, e.stageY));
                mouseDownXY = {x: e.stageX, y: e.stageY};
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

        // drop inside the canvas for drag starting from inside the canvas
        formationStage.on('pressup', function(e){
            var unit = e.target;

            if (unit.name === 'unit' || mouseDownXY) {
                self._handleDrop(mouseDownXY, {x: e.stageX, y: e.stageY});
                mouseDownXY = undefined;
            }
        });

        // click inside the canvas
        formationStage.on('click', function(e){
            var remove = e.target,
                position;

            if (remove.name === 'remove') {
                position = sideView.getPositionByXY(e.stageX, e.stageY);
                sideView.updateFormationData({removes: [position]});
            }
        });
    };

    FormationView.prototype._handleDrop = function(from, to) {
        var self            = this,
            sideView        = self._sideView,
            isFromXY        = from.x !== undefined && from.y !== undefined,
            targetPosition  = sideView.getPositionByXY(to.x, to.y),
            sourcePosition,
            unitData;

        if (isFromXY) {
            sourcePosition = sideView.getPositionByXY(from.x, from.y);
            unitData = sideView.getUnitDataAt(sourcePosition);
        } else {
            unitData = from;
        }

        // if there isn't a source(drag from outside) or a target(drop to outside of slots),
        // no need to remove from the original position
        if (sourcePosition && targetPosition) {
            sideView.updateFormationData({removes: [sourcePosition]});
        }

        // only need to udpate position if there is a target(drop to inside a slot)
        if (targetPosition) {
            unitData.position = targetPosition;
        }

        // only render if there is a source(drag from inside) or a target(drop to inside of slots)
        if (sourcePosition || targetPosition) {
            sideView.updateFormationData({updates: [unitData]});
        }
    };

    FormationView.prototype._handleMouseOverAt = function(x, y) {
        this._sideView.toggleHighlightByXY(x, y, true, false);
    };

    Y.namespace('Battlefield').FormationView = FormationView;

}, '0.0.0', {requires: ['battlefield-side-view']});