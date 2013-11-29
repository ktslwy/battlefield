var assert          = require('chai').assert,
    LightInfantry   = require('../../../models/light-infantry');

describe('LightInfantry', function(){

    it('should instantiate', function(){
    	var lightInfantry = new LightInfantry();
    	assert.isTrue(lightInfantry instanceof LightInfantry);
    });

});