/*globals createjs*/

YUI.add('battlefield-spritesheets', function (Y) {
    'use strict';

    var leftFrames, rightFrames, animations, spriteSheets;

    // fit them into the same box
    function fitFrames(frames) {
        var maxHeight = 0,
            maxWidth = 0;

        Y.each(frames, function(frame){
            if (frame[2] > maxWidth) {
                maxWidth = frame[2];
            }
            if (frame[3] > maxHeight) {
                maxHeight = frame[3];
            }
        });

        // set the regX regY so they fit into the same box
        Y.each(frames, function(frame){
            frame[4] = 0; // set default image index
            frame[5] = frame[2] - maxWidth;
            frame[6] = frame[3] - maxHeight;
        });

        // add an init frame to store the max frame size
        frames.push([-99999, -99999, maxWidth, maxHeight]);

        return frames;
    }

    function flipHorizontal(frames, sheetWidth) {
        var flippedFrames = Y.Array.map(frames, function(frame){
            var flippedFrame = [
                sheetWidth - frame[0] - frame[2],
                frame[1],
                frame[2],
                frame[3],
                0,
                0,
                frame[6]
            ];

            return flippedFrame;
        });

        return flippedFrames;
    }

    leftFrames = fitFrames([
        // [x, y, width, height]

        // stand
        [  7,  25, 32, 40], // 0
        [ 44,  25, 32, 40], // 1
        [ 82,  25, 33, 40], // 2
        [120,  25, 34, 40], // 3
        [158,  25, 33, 40], // 4
        [196,  25, 32, 40], // 5

        // run
        [  7,  73, 35, 43], // 6
        [ 47,  72, 36, 44], // 7
        [ 88,  72, 36, 40], // 8
        [129,  73, 32, 43], // 9
        [167,  73, 33, 43], // 10
        [206,  74, 33, 42], // 11
        [246,  73, 35, 43], // 12
        [286,  72, 38, 44], // 13
        [328,  72, 40, 40], // 14
        [372,  73, 35, 43], // 15
        [412,  74, 32, 42], // 16
        [450,  74, 33, 42], // 17

        // fire
        [ 20, 187, 24, 41], // 18
        [ 20, 236, 34, 41], // 19
        [ 61, 236, 50, 41], // 20
        [118, 237, 54, 40], // 21
        [ 21, 288, 67, 40], // 22
        [ 96, 288, 69, 40], // 23
        [171, 288, 67, 40], // 24
        [244, 288, 53, 40]  // 25
    ]);

    rightFrames = flipHorizontal(leftFrames, 496);

    animations = {
        stand : [0, 5],
        walk  : [6, 17],
        fire  : { frames: [18, 19, 20, 21, 22, 23, 24, 25, 21, 20, 19, 18] },
        init  : [leftFrames.length - 1]
    };

    spriteSheets = {
        LightInfantry : 'LightInfantry',
        HeavyInfantry : 'HeavyInfantry'
    };

    Y.namespace('Battlefield').SpriteSheets = {

        loadSpriteSheets : function() {
            var assets = Y.Battlefield.Assets;

            Y.each(spriteSheets, function(assetKey, spriteSheetName){
                spriteSheets[spriteSheetName] = {
                    left: new createjs.SpriteSheet({
                        animations: animations,
                        images: [assets[assetKey + 'LeftSpriteSheet']],
                        frames: leftFrames
                    }),
                    right: new createjs.SpriteSheet({
                        animations: animations,
                        images: [assets[assetKey+ 'RightSpriteSheet']],
                        frames: rightFrames
                    })
                };
            });

            Y.Battlefield.SpriteSheets = spriteSheets;
        }
    };

}, '0.0.0', {requires: ['array-extras']});