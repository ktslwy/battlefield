/*jshint browser:true*/

YUI.add('battlefield-assets', function (Y) {
    'use strict';

    var assets = {
        BackgroundTexture               : '/img/background-texture.png',
        LightInfantryLeftSpriteSheet    : '/img/light-infantry-left.png',
        LightInfantryRightSpriteSheet   : '/img/light-infantry-right.png',
        HeavyInfantryLeftSpriteSheet    : '/img/heavy-infantry-left.png',
        HeavyInfantryRightSpriteSheet   : '/img/heavy-infantry-right.png',
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