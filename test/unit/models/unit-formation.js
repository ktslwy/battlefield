var assert          = require('chai').assert,
    UnitFormation   = require('../../../models/unit-formation'),
    allLiFormation	= require('../../../samples/formation/all-li'),
    LightInfantry   = require('../../../models/light-infantry');

describe('UnitFormation', function(){

    it('should instantiate without config', function(){
    	var unitFormation = new UnitFormation();
    	assert.isTrue(unitFormation instanceof UnitFormation);
    });

    it('should instantiate with config', function(){
    	var unitFormation = new UnitFormation({formation: allLiFormation});

    	assert.isTrue(unitFormation instanceof UnitFormation);
        unitFormation.formation.forEach(function(entry, i){
            assert.isTrue(entry.unit instanceof LightInfantry);
            assert.equal(entry.position, allLiFormation[i].position);
        });
    });

});