'use strict';

var express = require('express'),
    http    = require('http'),
    path 	= require('path'),
    app     = express();

app.set('port', 3000);
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    var index = require('./index'),
        battle = index(req.query.left, req.query.right);

    res.json(battle);
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});