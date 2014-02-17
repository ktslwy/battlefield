/*jshint browser:true*/
/*globals createjs*/

YUI.add('battlefield-side-view', function (Y) {
    'use strict';

    function SideView(config) {
        var self = this;

        self.config = config;
    }

    SideView.prototype.render = function(callback) {
        var self            = this,
            slotContainers  = self.config.slotContainers,
            units           = self.config.formationData.formation,
            unitViews       = [];

        self._unitViewsRenderedCallback = callback;
        self._unitViewsRendered = [];

        Y.Array.forEach(units, function(unitData, i){
            var unitView = new Y.Battlefield.UnitView({
                unitData        : unitData,
                slotContainer   : slotContainers[unitData.position - 1]
            });

            unitView.render(self._handleUnitViewsRendered.bind(self, i));
            unitViews[i] = unitView;
        });

        self.unitViews = unitViews;
    };

    SideView.prototype._handleUnitViewsRendered = function(i) {
        var self                = this,
            unitViews           = self.unitViews,
            unitViewsRendered   = self._unitViewsRendered;

        unitViewsRendered[i] = true;

        if (Y.Array.every(unitViews, function(unitView, i){ return !!unitViewsRendered[i]; })) {
            self._unitViewsRenderedCallback();
        }
    };

    SideView.prototype.renderAction = function(option, callback) {
        var self        = this,
            action      = option.action,
            role        = option.role,
            effects     = action.effects,
            unitPos     = action[role].position,
            unitView    = self._getUnitViewByPos(unitPos);

        if (role === 'source') {
            unitView.renderAction({ role: role }, callback);
        } else if (role === 'target') {
            unitView.renderAction({ role: role, effects: effects }, callback);
        }
    };

    SideView.prototype._getUnitViewByPos = function(pos) {
        var self        = this,
            unitViews   = self.unitViews,
            foundUnitView;

        Y.Array.some(unitViews, function(unitView){
            if (unitView.config.unitData.position === pos) {
                foundUnitView = unitView;
                return true;
            }
            return false;
        });

        return foundUnitView;
    };

    Y.namespace('Battlefield').SideView = SideView;

}, '0.0.0', {requires: ['battlefield-unit-view']});