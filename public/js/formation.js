YUI.add('battlefield-formation', function (Y) {
    'use strict';

    function Formation(config) {
        var self = this,
            formationStage = config.formationStage;

        self.config = config;

        self.formationView = new Y.Battlefield.FormationView({
            formationStage: formationStage
        });
    }

    Formation.prototype.init = function() {
        var self = this;

        self.formationView.render();
    };

    Y.namespace('Battlefield').Formation = Formation;

}, '0.0.0', {requires: ['battlefield-formation-view']});