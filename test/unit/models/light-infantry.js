var assert          = require('chai').assert,
    LightInfantry   = require('../../../models/light-infantry'),
    BaseUnit 	    = require('../../../models/base-unit');

describe('LightInfantry', function(){

    it('should instantiate', function(){
        var lightInfantry = new LightInfantry();
        assert.isTrue(lightInfantry instanceof LightInfantry);
        assert.isTrue(lightInfantry instanceof BaseUnit);
    });

});