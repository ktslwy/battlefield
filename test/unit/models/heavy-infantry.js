var assert          = require('chai').assert,
    HeavyInfantry   = require('../../../models/heavy-infantry'),
    BaseUnit 	    = require('../../../models/base-unit');

describe('HeavyInfantry', function(){

    it('should instantiate', function(){
        var heavyInfantry = new HeavyInfantry();
        assert.isTrue(heavyInfantry instanceof HeavyInfantry);
        assert.isTrue(heavyInfantry instanceof BaseUnit);
    });

});