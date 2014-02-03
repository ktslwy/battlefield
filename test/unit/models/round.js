var assert          = require('chai').assert,
    Round          = require('../../../models/round'),
    UnitFormation   = require('../../../models/unit-formation'),
    allLiFormation  = require('../../../samples/formation/li-li'),
    allHiFormation  = require('../../../samples/formation/hi-hi'),
    LightInfantry   = require('../../../models/light-infantry'),
    HeavyInfantry   = require('../../../models/heavy-infantry'),
    BaseUnit        = require('../../../models/base-unit');

function getRoundConfigWithFormations() {
    return {
        roundNumber    : 1,
        leftFormation  : new UnitFormation({formation: allLiFormation}),
        rightFormation : new UnitFormation({formation: allHiFormation})
    };
}

describe('Round', function(){
    var round;

    beforeEach(function(){
        round = new Round(getRoundConfigWithFormations());
        round._leftFormation.setSide(BaseUnit.SIDE_LEFT);
        round._rightFormation.setSide(BaseUnit.SIDE_RIGHT);
    });

    it('should instantiate without config', function(){
        var round = new Round();
        assert.isTrue(round instanceof Round);
    });

    it('should instantiate with config', function(){
        assert.isTrue(round instanceof Round);
        assert.isTrue(round._leftFormation instanceof UnitFormation);
        assert.isTrue(round._rightFormation instanceof UnitFormation);
    });

    describe('#_getAllUnits()', function(){

        it('should return all units from left and right formation', function(){
            var units = round._getAllUnits();

            allLiFormation.forEach(function(unit, i){
                assert.isTrue(units[i] instanceof LightInfantry);
                assert.equal(units[i].position, unit.position);
            });

            allHiFormation.forEach(function(unit, i){
                i += allLiFormation.length;
                assert.isTrue(units[i] instanceof HeavyInfantry);
                assert.equal(units[i].position, unit.position);
            });
        });

    });

    describe('#_getRoundUnits()', function(){

        it('should return filtered units based on actionInterval', function(){
            var units;

            units = round._getRoundUnits();
            assert.equal(units.length, allLiFormation.length);
            allLiFormation.forEach(function(unit, i){
                assert.isTrue(units[i] instanceof LightInfantry);
                assert.equal(units[i].position, unit.position);
            });

            round.roundNumber = 2;
            units = round._getRoundUnits();
            assert.equal(units.length, allLiFormation.length + allHiFormation.length);
            allLiFormation.forEach(function(unit, i){
                assert.isTrue(units[i] instanceof LightInfantry);
                assert.equal(units[i].position, unit.position);
            });
            allHiFormation.forEach(function(unit, i){
                i += allLiFormation.length;
                assert.isTrue(units[i] instanceof HeavyInfantry);
                assert.equal(units[i].position, unit.position);
            });
        });

        it('should return filtered units based on actionInterval and unit status', function(){
            var units;

            round._leftFormation.formation.forEach(function(unit){
                unit._die();
            });
            units = round._getRoundUnits();
            assert.equal(units.length, 0);
        });

    });

    describe('#setupQueue()', function(){

        it('should return randomized units of current round', function(){
            var units;

            round.setupQueue();
            units = round._queue;

            assert.equal(units.length, allLiFormation.length);
            assert.isTrue(units.some(function(unit, i){
                return unit.position !== allLiFormation[i].position;
            }));
        });

    });

    describe('#_getTargetUnit()', function(){

        it('should return target unit of regular position based on map', function(){
            var targetUnit = round._getTargetUnit({position: 7, side: BaseUnit.SIDE_LEFT});

            assert.equal(targetUnit.position, 9);
            assert.equal(targetUnit.side, BaseUnit.SIDE_RIGHT);
        });

        it('should return target unit of top left corner based on map', function(){
            var targetUnit = round._getTargetUnit({position: 1, side: BaseUnit.SIDE_LEFT});

            assert.equal(targetUnit.position, 4);
            assert.equal(targetUnit.side, BaseUnit.SIDE_RIGHT);
        });

        it('should return target unit of bottom right corner based on map', function(){
            var targetUnit = round._getTargetUnit({position: 25, side: BaseUnit.SIDE_RIGHT});

            assert.equal(targetUnit.position, 22);
            assert.equal(targetUnit.side, BaseUnit.SIDE_LEFT);
        });

    });

    describe('#executeQueue()', function(){

        it('should only execute units that are alive', function(done){
            round.setupQueue();

            var aliveUnit       = round._queue[4],
                deadUnit        = round._queue[2],
                _getTargetUnit  = round._getTargetUnit;

            deadUnit._die();

            round._getTargetUnit = function(unit) {
                if (unit === deadUnit) {
                    assert.fail();
                }
                return _getTargetUnit.call(round, unit);
            };

            deadUnit.attack = assert.fail;
            aliveUnit.attack = function() {
                done();
            };

            round.executeQueue();
        });

        it('should not attack if no target unit', function(done){
            round._getTargetUnit = function(){};
            round.setupQueue();
            round._queue.forEach(function(unit){
                unit.attack = assert.fail;
            });

            round.executeQueue();

            setTimeout(done, 300);
        });

        it('should not have reference of formation objects after execution', function(){
            round.setupQueue();
            round.executeQueue();

            assert.isNull(round._leftFormation);
            assert.isNull(round._rightFormation);
        });

    });

    describe('#_getState()', function(){

        it('should return a state object that will not be altered', function(){
            var state = round._getState(),
                refHealthPoint;

            round._leftFormation.formation[1] = null;
            assert.isNotNull(state.leftFormation.formation[1]);

            refHealthPoint = state.rightFormation.formation[2].stats.healthPoint;
            assert.isDefined(refHealthPoint);
            round._rightFormation.formation[2].stats.healthPoint = 10;
            assert.equal(state.rightFormation.formation[2].stats.healthPoint, refHealthPoint);
        });

    });

    describe('#_recordAction()', function(){

        it('should add action to the action array', function(){
            var sourceUnit  = {position: 7, side: BaseUnit.SIDE_LEFT},
                targetUnit  = {position: 1, side: BaseUnit.SIDE_RIGHT},
                damage      = 6,
                action;

            round.actions = [];
            round._recordAction(sourceUnit, targetUnit, damage);

            assert.equal(round.actions.length, 1);

            action = round.actions[0];

            assert.equal(action.source.position, sourceUnit.position);
            assert.equal(action.source.side, sourceUnit.side);
            assert.equal(action.target.position, targetUnit.position);
            assert.equal(action.target.side, targetUnit.side);
            assert.equal(action.effects[0].change, -6);
        });

    });

});