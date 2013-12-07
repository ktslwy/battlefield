// var assert          = require('chai').assert,
//     UnitFactory     = require('../../../lib/unit-factory'),
//     HeavyInfantry   = require('../../../models/heavy-infantry'),
//     unitFactory     = new UnitFactory();

describe('index.js', function() {

    it('should execute without error', function(){
        var consoleLog = console.log;
        console.log = function(){};
        require('../../index');
        console.log = consoleLog;
    });

});