/*jshint browser:true*/
/*globals createjs*/

YUI.add('battlefield-formation-view', function (Y) {
    'use strict';

    var appConfig = Y.AppConfig;

    function FormationView(config) {
        var self = this;

        self.config = config;
    }

    FormationView.prototype.render = function() {
        var self = this;

        self._renderBackground();
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

    Y.namespace('Battlefield').FormationView = FormationView;

}, '0.0.0', {requires: []});