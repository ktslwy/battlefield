var assert          = require('chai').assert,
    HeavyInfantry   = require('../../../models/heavy-infantry'),
    BaseUnit        = require('../../../models/base-unit');

describe('HeavyInfantry', function(){

    it('should instantiate', function(){
        var heavyInfantry = new HeavyInfantry();
        assert.isTrue(heavyInfantry instanceof HeavyInfantry);
        assert.isTrue(heavyInfantry instanceof BaseUnit);
    });

    describe('#toString()', function(){

        it('should print info', function(){
            var heavyInfantry = new HeavyInfantry(),
                expected;

            heavyInfantry.stats.healthPoint = '15';
            expected = '[HeavyInfantry] (alive) POS= HEA=15 ATT=1 DEF=2 ACT=2';
            assert.equal(heavyInfantry.toString(), expected);
        });

    });

});