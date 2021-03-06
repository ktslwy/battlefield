var assert          = require('chai').assert,
    Battle          = require('../../../models/battle'),
    UnitFormation   = require('../../../models/unit-formation'),
    allLiFormation  = require('../../../samples/formation/li-li'),
    allHiFormation  = require('../../../samples/formation/hi-hi'),
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
        battle._leftFormation.formation.forEach(function(unit){
            assert.equal(unit.side, BaseUnit.SIDE_LEFT);
        });
        battle._rightFormation.formation.forEach(function(unit){
            assert.equal(unit.side, BaseUnit.SIDE_RIGHT);
        });
    });

    describe('#_getWinningSide()', function(){

        it('should return null if both formations are alive', function(){
            var winningSide = battle._getWinningSide();

            assert.isNull(winningSide);
        });

        it('should return null if both formations are dead', function(){
            battle._leftFormation.formation.forEach(function(unit){
                unit._die();
            });
            battle._rightFormation.formation.forEach(function(unit){
                unit._die();
            });

            var winningSide = battle._getWinningSide();

            assert.isNull(winningSide);
        });

        it('should return the left side if the right side is not alive', function(){
            var winningSide;

            battle._leftFormation.formation.forEach(function(unit){
                unit._die();
            });
            winningSide = battle._getWinningSide();

            assert.equal(winningSide, BaseUnit.SIDE_RIGHT);
            assert.equal(battle.winningSide, winningSide);
        });

        it('should return the right side if the left side is not alive', function(){
            var winningSide;

            battle._rightFormation.formation.forEach(function(unit){
                unit._die();
            });
            winningSide = battle._getWinningSide();

            assert.equal(winningSide, BaseUnit.SIDE_LEFT);
            assert.equal(battle.winningSide, winningSide);
        });

        it('should return the cached value that is computed before', function(){
            var winningSide;

            battle.winningSide = BaseUnit.SIDE_LEFT;
            winningSide = battle._getWinningSide();

            assert.equal(winningSide, battle.winningSide);
        });

    });

    describe('#start()', function(){

        it('should exit immediately if winning side has been determined', function(){
            battle._rightFormation.formation.forEach(function(unit){
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
            };

            battle.nextRound = function(){
                assert.notEqual(executeCount, 2);
            };

            battle.start();

            setTimeout(done, 300);
        });

        it('should not init rounds if already inited', function(){
            battle.rounds = [1];

            battle._getWinningSide = function(){
                return BaseUnit.SIDE_RIGHT;
            };

            battle.start();

            assert.equal(battle.rounds[0], 1);
        });

    });

    describe('#nextRound()', function(){

        it('should exit early if winningSide is determined', function(){
            var currentRoundNumber = battle.currentRoundNumber;

            battle._getWinningSide = function(){
                return BaseUnit.SIDE_LEFT;
            };

            battle.nextRound();
            assert.equal(battle.currentRoundNumber, currentRoundNumber);
        });

        it('should increment round number', function(){
            var currentRoundNumber = battle.currentRoundNumber;

            battle.nextRound();
            assert.equal(battle.currentRoundNumber, currentRoundNumber + 1);
        });

    });

    describe('#_createNextRound()', function(){

        it('should create a round and append to the rounds array', function(){
            var round;

            battle.rounds = [];
            battle._createNextRound();

            assert.equal(battle.rounds.length, 1);

            round = battle.rounds[0];

            assert.equal(round.roundNumber, battle.currentRoundNumber);
        });

    });

});