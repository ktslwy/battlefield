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
        self._renderSide('left', handleRendered);
        self._renderSide('right', handleRendered);
    };

    BattleView.prototype._renderSide = function(side, callback) {
        var self            = this,
            battleStage     = self.config.battleStage,
            formationData   = self.config.battleStartState[side + 'Formation'],
            sideContainer   = self._getSideContainer(side),
            sideView;

        battleStage.addChild(sideContainer);

        sideView = new Y.Battlefield.SideView({
            side            : side,
            formationData   : formationData,
            container       : sideContainer
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

    BattleView.prototype._getSideContainer = function(side) {
        var self            = this,
            battleStage     = self.config.battleStage,
            canvas          = battleStage.canvas,
            sideContainer   = new createjs.Container();

        sideContainer.x = side === 'left' ? 0 : canvas.width - canvas.height;
        sideContainer.y = 0;
        sideContainer.setBounds(sideContainer.x, sideContainer.y, canvas.height, canvas.height);

        return sideContainer;
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