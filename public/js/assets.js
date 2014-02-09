/*jshint browser:true*/
/*globals createjs*/

YUI.add('battlefield-assets', function (Y) {
    'use strict';

    var assets = {
        backgroundTexture           : '/img/background-texture.png',
        lightInfantrySpriteSheet    : '/img/light-infantry.png',
        heavyInfantrySpriteSheet    : '/img/heavy-infantry.png',
    };

    function areAllAssetsLoaded() {
        for (var key in assets) {
            if (typeof assets[key] !== 'object') {
                return false;
            }
        }
        return true;
    }

    function loadAsset(callback, src, key) {
        var img = new Image();
        img.onload = function() {
            assets[key] = img;
            if (areAllAssetsLoaded()) {
                Y.Battlefield.Assets = assets;
                callback();
            }
        };
        img.src = src;
    }

    Y.namespace('Battlefield').Assets = {

        loadAssets : function(callback) {
            Y.each(assets, loadAsset.bind(null, callback));
        }

    };

}, '0.0.0', {requires: []});