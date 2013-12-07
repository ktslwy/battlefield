var assert          = require('chai').assert,
    Battle          = require('../../../models/battle'),
    UnitFormation   = require('../../../models/unit-formation'),
    allLiFormation  = require('../../../samples/formation/all-li'),
    allHiFormation  = require('../../../samples/formation/all-hi'),
    LightInfantry   = require('../../../models/light-infantry'),
    HeavyInfantry   = require('../../../models/heavy-infantry');
    BaseUnit        = require('../../../models/base-unit');

function getBattleConfigWithFormations() {
    return {
        leftFormation  : new UnitFormation({formation: allLiFormation}),
        rightFormation : new UnitFormation({formation: allHiFormation})
    };
}

describe('Battle', function(){
    var battle;

    beforeEach(function(){
        battle = new Battle(getBattleConfigWithFormations());
    });

    it('should instantiate without config', function(){
        var battle = new Battle();
        assert.isTrue(battle instanceof Battle);
    });

    it('should instantiate with config', function(){
        assert.isTrue(battle instanceof Battle);
        battle.leftFormation.formation.forEach(function(unit){
            assert.equal(unit.side, BaseUnit.SIDE_LEFT);
        })
        battle.rightFormation.formation.forEach(function(unit){
            assert.equal(unit.side, BaseUnit.SIDE_RIGHT);
        })
    });

    describe('#_getAllUnits()', function(){

        it('should return all units from left and right formation', function(){
            var units = battle._getAllUnits();

            allLiFormation.forEach(function(unit, i){
                assert.isTrue(units[i] instanceof LightInfantry);
                assert.equal(units[i].position, unit.position);
            });

            allHiFormation.forEach(function(unit, i){
                i += allLiFormation.length;
                assert.isTrue(units[i] instanceof HeavyInfantry);
                assert.equal(units[i].position, unit.position);
            })
        });

    });

    describe('#_getCurrentRoundUnits()', function(){

        it('should return filtered units based on actionInterval', function(){
            var units;

            battle.round = 1;
            units = battle._getCurrentRoundUnits();
            assert.equal(units.length, allLiFormation.length);
            allLiFormation.forEach(function(unit, i){
                assert.isTrue(units[i] instanceof LightInfantry);
                assert.equal(units[i].position, unit.position);
            });

            battle.round = 2;
            units = battle._getCurrentRoundUnits();
            assert.equal(units.length, allLiFormation.length + allHiFormation.length);
            allLiFormation.forEach(function(unit, i){
                assert.isTrue(units[i] instanceof LightInfantry);
                assert.equal(units[i].position, unit.position);
            });
            allHiFormation.forEach(function(unit, i){
                i += allLiFormation.length;
                assert.isTrue(units[i] instanceof HeavyInfantry);
                assert.equal(units[i].position, unit.position);
            })
        });

    });

    describe('#_setupRoundQueue()', function(){

        it('should return randomized units of current round', function(){
            var units;

            battle.round = 1;
            battle._setupRoundQueue();
            units = battle._roundQueue;

            assert.equal(units.length, allLiFormation.length);
            assert.isTrue(units.some(function(unit, i){
                return unit.position !== allLiFormation[i].position;
            }));
        });

    });

    describe('#_getTargetUnit()', function(){

        it('should return target unit of regular position based on map', function(){
            var targetUnit = battle._getTargetUnit({position: 7, side: BaseUnit.SIDE_LEFT});

            assert.equal(targetUnit.position, 9);
            assert.equal(targetUnit.side, BaseUnit.SIDE_RIGHT);
        });

        it('should return target unit of top left corner based on map', function(){
            var targetUnit = battle._getTargetUnit({position: 1, side: BaseUnit.SIDE_LEFT});

            assert.equal(targetUnit.position, 4);
            assert.equal(targetUnit.side, BaseUnit.SIDE_RIGHT);
        });

        it('should return target unit of bottom right corner based on map', function(){
            var targetUnit = battle._getTargetUnit({position: 25, side: BaseUnit.SIDE_RIGHT});

            assert.equal(targetUnit.position, 22);
            assert.equal(targetUnit.side, BaseUnit.SIDE_LEFT);
        });

    });

    describe('#_getWinningSide()', function(){

        it('should return null if both formations are alive', function(){
            var winningSide = battle._getWinningSide();

            assert.isNull(winningSide);
        });

        it('should return null if both formations are dead', function(){
            battle.leftFormation.formation.forEach(function(unit){
                unit._die();
            });
            battle.rightFormation.formation.forEach(function(unit){
                unit._die();
            });

            var winningSide = battle._getWinningSide();

            assert.isNull(winningSide);
        });

        it('should return the left side if the right side is not alive', function(){
            var winningSide;

            battle.leftFormation.formation.forEach(function(unit){
                unit._die();
            });
            winningSide = battle._getWinningSide();

            assert.equal(winningSide, BaseUnit.SIDE_RIGHT);
            assert.equal(battle._winningSide, winningSide);
        });

        it('should return the right side if the left side is not alive', function(){
            var winningSide;

            battle.rightFormation.formation.forEach(function(unit){
                unit._die();
            });
            winningSide = battle._getWinningSide();

            assert.equal(winningSide, BaseUnit.SIDE_LEFT);
            assert.equal(battle._winningSide, winningSide);
        });

        it('should return the cached value that is computed before', function(){
            var winningSide;

            battle._winningSide = BaseUnit.SIDE_LEFT;
            winningSide = battle._getWinningSide();

            assert.equal(winningSide, battle._winningSide);
        });

    });

    describe('#start()', function(){

        it('should exit immediately if winning side has been determined', function(){
            battle.rightFormation.formation.forEach(function(unit){
                unit._die();
            });

            battle.nextRound = assert.fail;
            battle.start();
        });

        it('should start next round if winning side has not been determined', function(done){
            var executeCount = 0;

            battle._getWinningSide = function(){
                if (executeCount !== 0) {
                    return BaseUnit.SIDE_RIGHT;
                }
                executeCount++;
            }

            battle.nextRound = function(){
                assert.notEqual(executeCount, 2);
            }

            battle.start();

            setTimeout(done, 300);
        });

    });

    describe('#_executeRoundQueue()', function(){

        it('should only execute units that are alive', function(done){
            battle._setupRoundQueue();

            var aliveUnit       = battle._roundQueue[4],
                deadUnit        = battle._roundQueue[2],
                _getTargetUnit  = battle._getTargetUnit;

            deadUnit._die();

            battle._getTargetUnit = function(unit) {
                if (unit === deadUnit) {
                    assert.fail();
                }
                return _getTargetUnit.call(battle, unit);
            };

            deadUnit.attack = assert.fail;
            aliveUnit.attack = function() {
                done();
            };

            battle._executeRoundQueue();
        });

        it('should not attack if no target unit', function(done){
            battle._getTargetUnit = function(){};
            battle._setupRoundQueue();
            battle._roundQueue.forEach(function(unit){
                unit.attack = assert.fail;
            });

            battle._executeRoundQueue();

            setTimeout(done, 300);
        });

    });

    describe('#nextRound()', function(){

        it('should exit early if winningSide is determined', function(){
            var round = battle.round;

            battle._getWinningSide = function(){
                return BaseUnit.SIDE_LEFT;
            };

            battle.nextRound();
            assert.equal(battle.round, round);
        });

        it('should increment round', function(){
            var round       = battle.round,
                consoleLog  = console.log;

            console.log = function(){};
            battle.nextRound();
            console.log = consoleLog;
            assert.equal(battle.round, round + 1);
        });

    });

});