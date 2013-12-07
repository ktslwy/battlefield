var assert              = require('chai').assert,
    Battle              = require('../../../models/battle');
    BattleController    = require('../../../controllers/battle-controller');

describe('BattleController', function(){

    it('should instantiate without config', function(){
        var battleController = new BattleController();
        assert.isTrue(battleController instanceof BattleController);
    });

    it('should instantiate with config', function(){
        var battle              = new Battle(),
            battleController    = new BattleController({battle: battle});
        assert.isTrue(battleController instanceof BattleController);
    });

    describe('#startBattle()', function(){

        it('should exit without error if no battle is set', function(){
            var battleController = new BattleController();
            battleController.startBattle();
        });

        it('should start battle if battle is set', function(done){
        var battle              = new Battle(),
            battleController    = new BattleController({battle: battle});
            battle.start = done;
            battleController.startBattle();
        });

    });

});