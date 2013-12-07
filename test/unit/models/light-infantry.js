var assert          = require('chai').assert,
    LightInfantry   = require('../../../models/light-infantry'),
    BaseUnit 	    = require('../../../models/base-unit');

describe('LightInfantry', function(){

    it('should instantiate', function(){
        var lightInfantry = new LightInfantry();
        assert.isTrue(lightInfantry instanceof LightInfantry);
        assert.isTrue(lightInfantry instanceof BaseUnit);
    });

    describe('#toString()', function(){

        it('should print info', function(){
            var lightInfantry = new LightInfantry(),
                expected;

            lightInfantry.stats.healthPoint = '15';
            expected = '[LightInfantry] (alive) POS= HEA=15 ATT=1 DEF=1 ACT=1';
            assert.equal(lightInfantry.toString(), expected);
        });

    });

});