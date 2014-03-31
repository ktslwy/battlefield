'use strict';

function setContext(req, res, next) {
    req.context = {};
    req.context.signedIn 	= !!req.session.userName;
    req.context.hasTeam 	= !!req.session.team;

    next();
}

module.exports = setContext;