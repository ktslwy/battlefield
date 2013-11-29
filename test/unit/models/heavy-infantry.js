var assert          = require('chai').assert,
    HeavyInfantry   = require('../../../models/heavy-infantry');

describe('HeavyInfantry', function(){

    it('should instantiate', function(){
    	var heavyInfantry = new HeavyInfantry();
    	assert.isTrue(heavyInfantry instanceof HeavyInfantry);
    });

});