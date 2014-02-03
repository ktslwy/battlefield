'use strict';

var express = require('express'),
    http    = require('http'),
    app     = express();

app.set('port', 3000);

app.use(app.router);

app.get('/', function(req, res){
    var index = require('./index'),
        battle = index(req.query.left, req.query.right);

    res.json(battle);
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});