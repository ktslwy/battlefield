var assert          = require('chai').assert,
    LightInfantry   = require('../../../models/light-infantry'),
    BaseUnit        = require('../../../models/base-unit');

describe('BaseUnit', function(){

    describe('#_computeDamage()', function(){

        it('should compute damage using the attack stats', function(){
            var lightInfantry = new LightInfantry(),
                damage = lightInfantry._computeDamage();
            assert.isTrue(damage >= 4 && damage <= 6);
        });

        it('should return damage of at least 1', function(){
            var lightInfantry = new LightInfantry(),
                damage;

            lightInfantry.stats.attack = -100;
            damage = lightInfantry._computeDamage();
            assert.equal(damage, 1);
        });

    });

    describe('#_takeDamage()', function(){

        it('should reduce damage using the defense stats and update health point', function(){
            var lightInfantry = new LightInfantry();
            
            lightInfantry._takeDamage(4);
            assert.equal(lightInfantry.stats.healthPoint, 16);
        });

        it('should set the unit to dead status if health point reach 0', function(){
            var lightInfantry = new LightInfantry();
            
            lightInfantry._takeDamage(100);
            assert.equal(lightInfantry.stats.healthPoint, 0);
            assert.isFalse(lightInfantry.isAlive());
        });

    });

    describe('#attack()', function(){

        it('should compute damage and put on the target', function(){
            var lightInfantry = new LightInfantry(),
                targetUnit    = new LightInfantry();

            lightInfantry.attack(targetUnit);
            assert.isTrue(targetUnit.stats.healthPoint >= 14 && targetUnit.stats.healthPoint <= 16);
        });

    });

    describe('#getData()', function(){

        it('should return an object that is not altered by changes to original object', function(){
            var lightInfantry   = new LightInfantry(),
                data            = lightInfantry.getData(),
                refHealthPoint = data.stats.healthPoint;

            assert.isDefined(refHealthPoint);
            lightInfantry.stats.healthPoint = 10;
            assert.equal(data.stats.healthPoint, refHealthPoint);
        });

    });

});