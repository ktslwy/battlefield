'use strict';

var redis       = require('redis'),
    redisConfig = require('../../configs/redis'),
    redisClient = redis.createClient(redisConfig.port, redisConfig.host);

function handleSignIn(req, res){
    var userName = req.body.userName;

    req.session.userName = userName;

    redisClient.exists('user:' + userName, function(err, reply){
        if (!reply) {
            redisClient.hset('user:' + userName, 'userName', userName, function(err, reply){
                renderResponse(res);
            });
        } else {
            renderResponse(res);
        }
    });
}

function renderResponse(res) {
    res.send();
}

module.exports = handleSignIn;