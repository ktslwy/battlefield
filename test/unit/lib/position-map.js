var assert          = require('chai').assert;

describe('PositionMap', function() {

    it('should be required without error', function(){
        var positionMap = require('../../../lib/position-map');
        assert.isTrue(!!positionMap);
    });

});