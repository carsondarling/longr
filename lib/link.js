var bookshelf = require('./db')();

var Link = bookshelf.Model.extend({
  tableName: 'link',
});

module.exports = Link;