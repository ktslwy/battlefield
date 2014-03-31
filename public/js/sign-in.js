/*jshint browser:true*/

YUI.add('battlefield-sign-in', function (Y) {
    'use strict';

    function SignIn(config) {
        var self = this;

        self.config = config;
        self._init();
    }

    SignIn.prototype._init = function() {
        var self = this,
            signInButton = self.config.button;

        signInButton.on('click', function(){
            if (!self._overlay) {
                self._overlay = self._createSignInOverlay();
            }

            self._overlay.set('visible', true);
        });

        self._maskClicks();
    };

    SignIn.prototype._createSignInOverlay = function() {
        var self            = this,
            overlaySrcNode  = Y.one('#sign-in-overlay'),
            signInSubmit    = overlaySrcNode.one('button'),
            overlay;

        overlay = new Y.Overlay({
            srcNode     : overlaySrcNode,
            visible     : false,
            constrain   : true,
            centered    : 'body',
            plugins     : [
                Y.Plugin.OverlayModal,
                Y.Plugin.OverlayKeepaligned,
                Y.Plugin.OverlayAutohide
            ]
        }).render();

        overlaySrcNode.removeClass('hidden');

        signInSubmit.on('click', self._handleSignInSubmit);

        return overlay;
    };

    SignIn.prototype._maskClicks = function() {
        var self = this;

        Y.one('body').delegate('click', function(e){
            var overlay = self._overlay;

            if (overlay && overlay.get('visible')) {
                e.preventDefault();
            }
        }, 'a');
    };

    SignIn.prototype._handleSignInSubmit = function() {
        var userNameField   = Y.one('#sign-in-username'),
            userNameText    = userNameField.get('value');

        Y.io('/signin', {
            method: 'POST',
            data: {
                userName: userNameText
            },
            on: {
                success: function(){
                    window.location.reload();
                }
            }
        });
    };

    Y.namespace('Battlefield').SignIn = SignIn;

}, '0.0.0', {requires: ['overlay', 'io-base', 'gallery-overlay-extras']});