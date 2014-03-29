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
        self._initUnitDrag();
        self._initDataAccess();
    };

    Formation.prototype._initUnitDrag = function() {
        var self = this;

        Y.one('.unit-list').delegate('dragstart', self._handleUnitDragStart, '.unit-thumbnail-wrapper', self);
    };

    Formation.prototype._handleUnitDragStart = function(e) {
        var target      = e.target,
            nativeEvent = e._event;

        nativeEvent.dataTransfer.effectAllowed = 'move';
        nativeEvent.dataTransfer.setData('unitName', target.ancestor('.unit-info').getData('unit-name'));
    };

    Formation.prototype._initDataAccess = function() {
        var self = this;

        Y.one('.save-formation').on('click', self._handleSaveFormation, self);
    };

    Formation.prototype._handleSaveFormation = function() {
        var self = this,
            formationData = self.formationView.get('formation');

        Y.io('/formation/', {
            method: 'POST',
            data: JSON.stringify(formationData),
            headers: {'Content-Type': 'application/json'}
        });
    };

    Y.namespace('Battlefield').Formation = Formation;

}, '0.0.0', {requires: ['battlefield-formation-view', 'node-event-delegate', 'io-base']});