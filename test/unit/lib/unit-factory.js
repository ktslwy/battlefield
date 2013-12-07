var assert          = require('chai').assert,
    UnitFactory     = require('../../../lib/unit-factory'),
    HeavyInfantry   = require('../../../models/heavy-infantry'),
    unitFactory     = new UnitFactory();

describe('UnitFactory', function() {

    describe('#buildUnit()', function() {

        it('should build unit from string config', function(){
            var heavyInfantry = unitFactory.buildUnit({type: 'hi', position: 1});
            assert.isTrue(heavyInfantry instanceof HeavyInfantry);
        });

        it('should not build unit without config', function(){
            var unit = unitFactory.buildUnit();
            assert.isFalse(!!unit);
        });

        it('should not build unit without type in config', function(){
            var unit = unitFactory.buildUnit({});
            assert.isFalse(!!unit);
        });

    });

    describe('#_buildUnitFromStandard()', function() {

        it('should not build unit without mataching standard key', function(){
            var unit = unitFactory._buildUnitFromStandard();
            assert.isFalse(!!unit);
        });

    });

});