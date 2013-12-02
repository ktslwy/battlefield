var assert          = require('chai').assert,
    Battle          = require('../../../models/battle'),
    UnitFormation   = require('../../../models/unit-formation'),
    allLiFormation  = require('../../../samples/formation/all-li'),
    allHiFormation  = require('../../../samples/formation/all-hi'),
    LightInfantry   = require('../../../models/light-infantry'),
    HeavyInfantry   = require('../../../models/heavy-infantry');

function getBattleConfigWithFormations() {
    return {
        leftFormation  : new UnitFormation({formation: allLiFormation}),
        rightFormation : new UnitFormation({formation: allHiFormation})
    };
}

describe('Battle', function(){

    it('should instantiate without config', function(){
    	var battle = new Battle();
    	assert.isTrue(battle instanceof Battle);
    });

    it('should instantiate with config', function(){
        var battleConfig = getBattleConfigWithFormations(),
            battle       = new Battle(battleConfig);
        assert.isTrue(battle instanceof Battle);
    });

    describe('#_getAllUnits()', function(){

        it('should return all units from left and right formation', function(){
            var battleConfig = getBattleConfigWithFormations(),
                battle       = new Battle(battleConfig),
                units        = battle._getAllUnits();

            allLiFormation.forEach(function(entry, i){
                assert.isTrue(units[i].unit instanceof LightInfantry);
                assert.equal(units[i].position, entry.position);
            });

            allHiFormation.forEach(function(entry, i){
                i += allLiFormation.length;
                assert.isTrue(units[i].unit instanceof HeavyInfantry);
                assert.equal(units[i].position, entry.position);
            })
        });

    });

    describe('#_getCurrentRoundUnits()', function(){

        it('should return filtered units based on actionInterval', function(){
            var battleConfig = getBattleConfigWithFormations(),
                battle       = new Battle(battleConfig),
                units        = battle._getCurrentRoundUnits();

            assert.equal(units.length, allLiFormation.length);
            allLiFormation.forEach(function(entry, i){
                assert.isTrue(units[i].unit instanceof LightInfantry);
                assert.equal(units[i].position, entry.position);
            });

            battle.round = 2;
            units = battle._getCurrentRoundUnits();
            assert.equal(units.length, allLiFormation.length + allHiFormation.length);
            allLiFormation.forEach(function(entry, i){
                assert.isTrue(units[i].unit instanceof LightInfantry);
                assert.equal(units[i].position, entry.position);
            });
            allHiFormation.forEach(function(entry, i){
                i += allLiFormation.length;
                assert.isTrue(units[i].unit instanceof HeavyInfantry);
                assert.equal(units[i].position, entry.position);
            })
        });

    });

    describe('#_setupRoundQueue()', function(){

        it('should return randomized units of current round', function(){
            var battleConfig = getBattleConfigWithFormations(),
                battle       = new Battle(battleConfig),
                units;

            battle._setupRoundQueue();
            units = battle._roundQueue;

            assert.equal(units.length, allLiFormation.length);
            assert.isTrue(units.some(function(unit, i){
                return unit.position !== allLiFormation[i].position;
            }));
        });

    });

});