var debug = require('debug')('longr');

/**
 * Configuration
 * =============================================================================
 */

var config = {};
config.PORT = process.env.PORT || 6430;
config.DOMAIN = process.env.DOMAIN || 'http://localhost:' + config.PORT;
config.DB_PATH = process.env.DB_PATH || ':memory:';
config.ALPHABET = process.env.ALPHABET || 'hFDlqf4LXAMZonzat92xui51OpvjB0cCQY3kWdU8GVH7s6KEwPrTembJySgNRI';
config.AUTH_USER = process.env.AUTH_USER || null;
config.AUTH_PASS = process.env.AUTH_PASS || null;

/**
 * Start the App
 * =============================================================================
 */

var app = require('./lib')(config);
app.initialize(function() {
  app.listen(config.PORT);
  debug('Listening on %s', config.PORT);
});