var assert          = require('chai').assert,
    UnitFormation   = require('../../../models/unit-formation'),
    allLiFormation  = require('../../../samples/formation/li-li'),
    LightInfantry   = require('../../../models/light-infantry'),
    BaseUnit        = require('../../../models/base-unit');

describe('UnitFormation', function(){

    it('should instantiate without config', function(){
        var unitFormation = new UnitFormation();
        assert.isTrue(unitFormation instanceof UnitFormation);
    });

    it('should instantiate with config', function(){
        var unitFormation = new UnitFormation({formation: allLiFormation});

        assert.isTrue(unitFormation instanceof UnitFormation);
        unitFormation.formation.forEach(function(unit, i){
            assert.isTrue(unit instanceof LightInfantry);
            assert.equal(unit.position, allLiFormation[i].position);
        });
    });

    describe('#setSide()', function(){

        it('should set side of all units', function(){
            var unitFormation = new UnitFormation({formation: allLiFormation});

            unitFormation.setSide(BaseUnit.SIDE_LEFT);
            unitFormation.formation.forEach(function(unit){
                assert.equal(unit.side, BaseUnit.SIDE_LEFT);
            });

            unitFormation.setSide(null);
            unitFormation.formation.forEach(function(unit){
                assert.equal(unit.side, null);
            });
        });

    });

    describe('#getUnitByPosition()', function(){

        it('should return unit of the given position', function(){
            var unitFormation = new UnitFormation({formation: allLiFormation}),
                unit = unitFormation.getUnitByPosition(11);

            assert.isTrue(unit instanceof LightInfantry);
            assert.equal(unit.position, 11);
        });

    });

    describe('#areSomeAlive()', function(){

        it('should return true if all units are alive', function(){
            var unitFormation = new UnitFormation({formation: allLiFormation}),
                areSomeAlive = unitFormation.areSomeAlive();

            assert.isTrue(areSomeAlive);
        });

        it('should return true if some units are alive', function(){
            var unitFormation = new UnitFormation({formation: allLiFormation}),
                areSomeAlive;

            unitFormation.getUnitByPosition(11)._die();
            areSomeAlive = unitFormation.areSomeAlive();

            assert.isTrue(areSomeAlive);
        });

        it('should return false if no units are alive', function(){
            var unitFormation = new UnitFormation({formation: allLiFormation}),
                areSomeAlive;

            unitFormation.formation.forEach(function(unit){
                unit._die();
            });
            areSomeAlive = unitFormation.areSomeAlive();

            assert.isFalse(areSomeAlive);
        });

    });

    describe('#toString()', function(){

        it('should print info', function(){
            var unitFormation = new UnitFormation({formation: allLiFormation.slice(0, 2)}),
                expected;

            expected = '[LightInfantry] (alive) POS=1 HEA=20 ATT=1 DEF=1 ACT=1\n[LightInfantry] (alive) POS=2 HEA=20 ATT=1 DEF=1 ACT=1\n';
            assert.equal(unitFormation.toString(), expected);
        });

    });

});