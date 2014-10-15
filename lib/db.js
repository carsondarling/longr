var Knex = require('knex');
var bookshelf = require('bookshelf');
var debug = require('debug')('longr:db');

var db;

module.exports = function(path) {
  if (!db) {
    debug('Database path: %s', path);
    var knex = Knex({
      client: 'sqlite',
      connection: { filename: path }
    });

    db = bookshelf(knex);
  }

  return db;
};