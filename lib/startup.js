var fs = require('fs');
var bookshelf = require('./db')();

module.exports = function startup(config, callback) {
  initDatabase(config.DB_PATH).then(function() {
    return callback();
  });
};

function initDatabase(path) {
  // Check that we have permission to open the file
  if (path !== ':memory:') {
    try {
      fd = fs.openSync(path, 'r+');
      fs.closeSync(fd);
    } catch (e) {
      // If the file isn't there, that's okay
      if (e.code !== 'ENOENT') {
        console.error('ERROR: Unable to open database file for read/write');
        process.exit(0);
      }
    }
  }

  // Make the DB table if it doesn't exist
  return bookshelf.knex.schema.hasTable('link').then(function(exists) {
    if (!exists) {
      return bookshelf.knex.schema.createTable('link', function(t) {
        t.timestamps();
        t.increments('id').primary();
        t.string('url', 2083).unique().notNullable().index();
      });
    }
  });
}