/**
 * App Setup
 * =============================================================================
 */

module.exports = function(config) {
  var url = require('url');
  var validator = require('validator');
  var basicAuth = require('basic-auth');
  var express = require('express');
  var HTTPError = require('node-http-error');

  var debug = require('debug')('longr:app');
  var db = require('./db')(config.DB_PATH);
  var Link = require('./link');
  var mangle = require('./mangle')(config.ALPHABET);
  var startup = require('./startup');

  var app = express();


  /**
   * Returns a proper 401.
   */
  var failAuth = function failAuth(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.status(401).end();
  };

  /**
   * Authorization Middleware
   *
   * If AUTH_USER and AUTH_PASS are set, this makes sure that all requests for 
   * creating a short URL contain the correct user/pass combo. If AUTH_USER and/or
   * AUTH_PASS is not present, then it simply does nothing.
   */
  var auth;
  if (config.AUTH_USER && config.AUTH_PASS) {
    auth = function auth(req, res, next) {
      var user = basicAuth(req);
      if (!user || !user.name || !user.pass) return failAuth(res);
      if (user.name !== config.AUTH_USER) return failAuth(res);
      if (user.pass !== config.AUTH_PASS) return failAuth(res);

      return next();
    };
  } else {
    auth = function auth(req, res, next) {
      return next();
    };
  }

  /**
   * Creates a shortened link.
   *
   * When a request is received, the URL provided is checked to be valid, and then
   * we attempt to look up that URL. If the URL is already in the database, the
   * same link is provided. If it is not in the database, we create a new token
   * and link, and return them.
   */
  app.post('/', auth, function(req, res, next) {
    var target = req.query.url;
    if (!target) return next(new HTTPError(400, 'No URL provided'));
    if (!validator.isURL(target, {require_protocol: true})) {
      return next(new HTTPError(400, 'Invalid URL'));
    }

    debug('Creating link for %s', target);

    var link = new Link({ url: target });

    link.fetch().then(function(savedLink) {
        if (!savedLink) return link.save();
        debug('found saved link');
        link = savedLink;
      }).then(function() {
        debug('sending link');
        var token = mangle.encode(link.id);
        var u = url.resolve(config.DOMAIN, token);
        return res.json({
          target: target,
          url: u
        });
      })
      .otherwise(function(err) {
        next(err);
      });
  });

  /**
   * Claim a shortened URL. This looks up the given token from the database, and
   * issues a 301 redirect to the correct url. If the token is not found, it
   * returns a 404.
   */
  app.get('/:token', function(req, res, next) {
    debug('grabbing token');
    var token = req.params.token;
    var id = mangle.decode(token);

    new Link({id: id}).fetch().then(function(link) {
      if (!link) return res.status(404).end();

      var target = link.get('url');
      debug('found link %s -> %s', token, target);

      return res.redirect(target);
    });
  });

  /**
   * System status URL
   */
  app.get('/', function(req, res, next) {
    res.status(200).end();
  });

  /**
   * Error handler
   */
  app.use(function(err, req, res, next) {
    debug('Error: ' + err);

    var status = err.status || 500;
    var message = err.message;

    res.status(status);
    res.set('Cache-Control', 'no-store');
    res.set('Pragma', 'no-cache');
    res.send({ error: {
      message: err.message
    }});
  });

  /**
   * Function to initialize the app, including starting up the DB.
   */
  app.initialize = function(callback) {
    startup(config, callback);
  };

  return app;
};
