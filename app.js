'use strict';

var express     = require('express'),
    http        = require('http'),
    path        = require('path'),
    cons        = require('consolidate'),
    dustjs      = require('dustjs-linkedin'),
    app         = express(),
    controllers;

controllers = {
    battlePage      : require('./controllers/pages/battle-page'),
    formationPage   : require('./controllers/pages/formation-page'),
    saveFormation   : require('./controllers/services/save-formation')
};

// retain whitespace and newlines
dustjs.optimizers.format = function(ctx, node) { return node; };

app.set('port', 3000);
app.engine('dust', cons.dust);
app.set('view engine', 'dust');
app.set('views', path.join(__dirname, 'views'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', controllers.battlePage);
app.get('/formation', controllers.formationPage);
app.post('/formation', controllers.saveFormation);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});