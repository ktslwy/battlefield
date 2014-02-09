YUI.add('battlefield-spritesheets', function (Y) {
    'use strict';

    // fit them into the same box
    function fitFrames(frames) {
        var maxHeight = 0,
            maxWidth = 0;

        frames.forEach(function(frame){
            if (frame[2] > maxWidth) {
                maxWidth = frame[2];
            }
            if (frame[3] > maxHeight) {
                maxHeight = frame[3];
            }
        });

        // set the regX regY so they fit into the same box
        frames.forEach(function(frame){
            frame[4] = 0; // set default image index
            frame[5] = frame[2] - maxWidth;
            frame[6] = frame[3] - maxHeight;
        });

        return frames;
    }

    var frames = fitFrames([
        // stand
        [ 14,  50, 64, 80], // 0
        [ 88,  50, 64, 80], // 1
        [164,  50, 66, 80], // 2
        [240,  50, 68, 80], // 3
        [316,  50, 66, 80], // 4
        [392,  50, 64, 80], // 5

        // run
        [ 14, 146, 70, 86], // 6
        [ 94, 144, 72, 88], // 7
        [176, 144, 72, 80], // 8
        [258, 146, 64, 86], // 9
        [334, 146, 66, 86], // 10
        [412, 148, 66, 84], // 11
        [492, 146, 70, 86], // 12
        [572, 144, 76, 88], // 13
        [656, 144, 80, 80], // 14
        [744, 146, 70, 86], // 15
        [824, 148, 64, 84], // 16
        [900, 148, 66, 84], // 17

        // fire
        [ 40, 374,  48, 82], // 18
        [ 40, 472,  68, 82], // 19
        [122, 472, 100, 82], // 20
        [236, 474, 108, 80], // 21
        [ 42, 576, 134, 80], // 22
        [192, 576, 138, 80], // 23
        [342, 576, 134, 80], // 24
        [488, 576, 106, 80]  // 25
    ]);

    var animations = {
        stand : [0, 5],
        walk  : [6, 17],
        fire  : { frames: [18, 19, 20, 21, 22, 23, 24, 25, 21, 20, 19, 18] }
    };

    var spriteSheets = {
        'light-infantry' : new createjs.SpriteSheet({
            animations: animations,
            images: ['/img/light-infantry.png'],
            frames: frames
        }),
        'heavy-infantry' : new createjs.SpriteSheet({
            animations: animations,
            images: ['/img/heavy-infantry.png'],
            frames: frames
        })
    };

    Y.namespace('Battlefield').SpriteSheets = {
        getSpriteSheet : function(name) {
            if (name) {
                return spriteSheets[name];
            }
        }
    };

}, '0.0.0', {requires: []});