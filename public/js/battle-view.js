/*jshint browser:true*/
/*globals createjs*/

YUI.add('battlefield-battle-view', function (Y) {
    'use strict';

    var appConfig = Y.AppConfig;

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
            slotSize            = { width: appConfig.slotSize.width, height: appConfig.slotSize.height },
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
            slotIndexText   = new createjs.Text(index, 'bold 11px monospace', '#000');

        slotContainer.x = x;
        slotContainer.y = y;
        slotContainer.setBounds(x, y, appConfig.slotSize.width, appConfig.slotSize.height);

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
        var self        = this,
            actions     = Y.clone(roundData.actions),
            actionQueue = self._createActionsRenderQueue(actions, callback);

        actionQueue.run();
    };

    BattleView.prototype._createActionsRenderQueue = function(actions, callback) {
        var self        = this,
            rendering   = {},
            actionQueue = new Y.AsyncQueue(),
            toRender    = null,
            waitForEverything = false;

        function handleRendered(id) {
            delete rendering[id];

            var isBlockingToRender      = toRender && (rendering[toRender[0]] || rendering[toRender[1]]),
                isEverythingRendered    = !toRender && Y.Object.isEmpty(rendering);

            if (!actionQueue.isRunning()) {
                if (!isBlockingToRender && (!waitForEverything || isEverythingRendered)) {
                    toRender = null;
                    actionQueue.run();
                }
            }
        }

        Y.each(actions, function(currentAction, i){
            var currentSource   = currentAction.source,
                currentSourceId = currentSource.side + currentSource.position,
                currentTarget   = currentAction.target,
                currentTargetId = currentTarget.side + currentTarget.position,
                nextAction      = actions[i+1];

            actionQueue.add(function(){
                var nextSource, nextSourceId, nextTarget, nextTargetId;

                rendering[currentSourceId] = true;
                rendering[currentTargetId] = true;

                if (nextAction) {
                    nextSource      = nextAction.source;
                    nextSourceId    = nextSource.side + nextSource.position;
                    nextTarget      = nextAction.target;
                    nextTargetId    = nextTarget.side + nextTarget.position;

                    // if the next action's units are rendering, pause now
                    if (rendering[nextTargetId] || rendering[nextSourceId]) {
                        toRender = [ nextSourceId, nextTargetId ];
                        actionQueue.pause();
                    }
                } else {
                    // if this is the last action, pause and wait for everything to finish before the last callback
                    waitForEverything = true;
                    actionQueue.pause();
                }

                setTimeout(function(){
                    self.sideViews[currentSource.side].renderAction({
                        role: 'source',
                        action: currentAction
                    }, handleRendered.bind(self, currentSourceId));
                    self.sideViews[currentTarget.side].renderAction({
                        role: 'target',
                        action: currentAction
                    }, handleRendered.bind(self, currentTargetId));
                }, Math.random()*500);
            });
        });

        actionQueue.add(callback);

        return actionQueue;
    };

    Y.namespace('Battlefield').BattleView = BattleView;

}, '0.0.0', {requires: ['battlefield-side-view', 'async-queue']});