'use strict';

var express     = require('express'),
    RedisStore  = require('connect-redis')(express),
    http        = require('http'),
    path        = require('path'),
    cons        = require('consolidate'),
    dustjs      = require('dustjs-linkedin'),
    redis       = require('redis'),
    redisConfig = require('./configs/redis'),
    redisClient = redis.createClient(redisConfig.port, redisConfig.host),
    redisStore  = new RedisStore({ client: redisClient }),
    app         = express(),
    middlewares,
    controllers;

controllers = {
    homePage        : require('./controllers/pages/home-page'),
    battlePage      : require('./controllers/pages/battle-page'),
    formationPage   : require('./controllers/pages/formation-page'),
    signInService   : require('./controllers/services/sign-in')
};

middlewares = {
    contextualizer  : require('./middlewares/contextualizer')
};

// retain whitespace and newlines
dustjs.optimizers.format = function(ctx, node) { return node; };

app.set('port', 3000);
app.engine('dust', cons.dust);
app.set('view engine', 'dust');
app.set('views', path.join(__dirname, 'views'));

app.use(express.cookieParser('S3CRE7'));
app.use(express.session({ store: redisStore, key: 'sid' }));
app.use(express.bodyParser());
app.use(middlewares.contextualizer);
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', controllers.homePage);
app.get('/battle', controllers.battlePage);
app.get('/formation', controllers.formationPage);
app.post('/signin', controllers.signInService);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});