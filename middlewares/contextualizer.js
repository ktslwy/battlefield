'use strict';

function setContext(req, res, next) {
    req.context = {};
    req.context.signedIn = !!req.session.userName;
    
    next();
}

module.exports = setContext;