/*jshint browser:true*/
/*globals createjs*/

YUI.add('battlefield-side-view', function (Y) {
    'use strict';

    function SideView(config) {
        var self = this;

        self.config = config;
    }

    SideView.prototype.render = function() {
        var self            = this,
            slotContainers  = self.config.slotContainers,
            units           = self.config.formationData.formation,
            unitViews       = [];

        Y.Array.forEach(units, function(unitData, i){
            var unitView = new Y.Battlefield.UnitView({
                unitData        : unitData,
                slotContainer   : slotContainers[unitData.position - 1]
            });

            unitView.render();
            unitViews[i] = unitView;
        });

        self.unitViews = unitViews;
    };

    Y.namespace('Battlefield').SideView = SideView;

}, '0.0.0', {requires: ['battlefield-unit-view']});