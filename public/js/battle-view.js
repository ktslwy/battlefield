/*jshint browser:true*/
/*globals createjs*/

YUI.add('battlefield-battle-view', function (Y) {
    'use strict';

    function BattleView(config) {
        var self = this;

        self.config = config;
    }

    BattleView.prototype.render = function(callback) {
        var self = this,
            isLeftRendered,
            isRightRendered;

        function handleRendered(side) {
            if (side === 'left') {
                isLeftRendered = true;
            } else if (side === 'right') {
                isRightRendered = true;
            }
            if (isLeftRendered && isRightRendered) {
                callback();
            }
        }

        self._renderBackground();
        self._renderSlots();
        self._renderSide('left', handleRendered);
        self._renderSide('right', handleRendered);
    };

    BattleView.prototype._renderSide = function(side, callback) {
        var self            = this,
            formationData   = self.config.battleStartState[side + 'Formation'],
            slotContainers  = self.slotContainers[side],
            sideView;

        sideView = new Y.Battlefield.SideView({
            formationData  : formationData,
            slotContainers : slotContainers
        });

        sideView.render(callback.bind(self, side));

        if (!self.sideViews) {
            self.sideViews = {};
        }

        self.sideViews[side] = sideView;
    };

    BattleView.prototype._renderBackground = function() {
        var self            = this,
            assets          = Y.Battlefield.Assets,
            battleStage     = self.config.battleStage,
            canvas          = battleStage.canvas,
            backgroundShape = new createjs.Shape();

        backgroundShape.x = 0;
        backgroundShape.y = 0;
        backgroundShape.graphics.beginBitmapFill(assets.BackgroundTexture,'repeat').drawRect(0, 0, canvas.width, canvas.height);
        battleStage.addChild(backgroundShape);

        self.backgroundShape = backgroundShape;
    };

    BattleView.prototype._renderSlots = function() {
        var self                = this,
            battleStage         = self.config.battleStage,
            canvas              = battleStage.canvas,
            slotGraphic         = new createjs.Graphics(),
            slotContainersLeft  = [],
            slotContainersRight = [],
            rows                = 5,
            columns             = 5,
            slotSize            = { width: 100, height: 100 },
            spacing             = self._computeSlotSpacing(canvas, slotSize, rows, columns),
            slotPositionX       = 0,
            slotPositionY       = 0,
            slotIndex           = 0,
            rowCount, columnCount;

        slotGraphic.beginFill('#ffffff').drawRoundRectComplex(0, 0, slotSize.width, slotSize.height, 10, 10, 10, 10).endFill();

        for (rowCount=0; rowCount<rows; rowCount++) {
            slotPositionY += spacing;
            for (columnCount=0; columnCount<columns; columnCount++) {
                slotPositionX += spacing;
                slotContainersLeft[slotIndex] = self._getSlotContainer(slotIndex + 1, slotPositionX, slotPositionY, slotGraphic);
                slotContainersRight[slotIndex] = self._getSlotContainer(slotIndex + 1, canvas.width - slotSize.width - slotPositionX, slotPositionY, slotGraphic);
                battleStage.addChild(slotContainersLeft[slotIndex]);
                battleStage.addChild(slotContainersRight[slotIndex]);
                slotPositionX += slotSize.width;
                slotIndex++;
            }
            slotPositionX = 0;
            slotPositionY += slotSize.height;
        }

        self.slotContainers = {
            left  : slotContainersLeft,
            right : slotContainersRight
        };
    };

    BattleView.prototype._getSlotContainer = function(index, x, y, slotGraphic) {
        var slotContainer   = new createjs.Container(),
            slotShape       = new createjs.Shape(slotGraphic),
            slotIndexText   = new createjs.Text(index, 'bold 14px monospace', '#111');

        slotContainer.x = x;
        slotContainer.y = y;
        slotContainer.setBounds(x, y, 100, 100);

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

    BattleView.prototype._computeSlotSpacing = function(canvas, slotSize, rows, columns) {
        var totalSlotHeight = rows * slotSize.height,
            totalSpacing    = canvas.height - totalSlotHeight,
            spacing         = totalSpacing / (rows + 1); // + 1 to include bottom border spacing

        return spacing;
    };

    BattleView.prototype.renderRound = function(roundData, callback) {
        var self = this,
            actions = Y.clone(roundData.actions);

        self._renderActions(actions, callback);
    };

    BattleView.prototype._renderActions = function(actions, callback) {
        var self     = this,
            action   = actions.splice(0, 1)[0],
            source   = action && action.source,
            target   = action && action.target,
            rendered = {};

        if (!action) {
            callback();
            return;
        }

        function handleRendered(role) {
            rendered[role] = true;
            if (rendered.source && rendered.target) {
                self._renderActions(actions, callback);
            }
        }

        self.sideViews[source.side].renderAction({ role: 'source', action: action }, handleRendered.bind(self, 'source'));
        self.sideViews[target.side].renderAction({ role: 'target', action: action }, handleRendered.bind(self, 'target'));
    };

    Y.namespace('Battlefield').BattleView = BattleView;

}, '0.0.0', {requires: ['battlefield-side-view']});