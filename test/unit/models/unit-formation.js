var assert          = require('chai').assert,
    UnitFormation   = require('../../../models/unit-formation'),
    allLiFormation  = require('../../../samples/formation/all-li'),
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
            unitFormation.formation.forEach(function(unit, i){
                assert.equal(unit.side, BaseUnit.SIDE_LEFT);
            });

            unitFormation.setSide(null);
            unitFormation.formation.forEach(function(unit, i){
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
        })

    });

});