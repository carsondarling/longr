

/**
 * Configuration
 * =============================================================================
 */

var config = {};
config.PORT = process.env.PORT || 6430;
config.DOMAIN = process.env.DOMAIN || 'http://localhost:' + config.PORT;
config.DB_PATH = process.env.DB_PATH || ':memory:';

var debug = require('debug')('longr');
var express = require('express');
var db = require('./lib/db')(config.DB_PATH);
var Link = require('./lib/link');

/**
 * App Setup
 * =============================================================================
 */

var app = express();

// Create a post
app.post('/', function(req, res, next) {
  var url = req.query.url;
  debug('Creating link for %s', url);

  var link = new Link({ url: url })
    .save()
    .then(function(link) {
      return res.json({
        target: url,
        url: link.mangle()
      });
    })
    .otherwise(function(err) {
      next(err);
    });
});

app.get('/:token', function(req, res, next) {

});


// Error handling
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
 * Start the App
 * =============================================================================
 */

var startup = require('lib/startup');
startup(config, function(err) {
  debug('Listening on %s', config.PORT);
  app.listen(config.PORT);
});
