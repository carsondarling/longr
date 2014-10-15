var url = require('url');

var baseConfig = {
  PORT: 8000,
  DOMAIN: 'http://localhost:8000',
  DB_PATH: ':memory:',
  ALPHABET: '0123456789'
};

// Build app tester
var app = require('../lib')(baseConfig);
var request = require('supertest')(app);

before(function(done) {
  app.initialize(done);
});

describe('longr', function() {
  it('should accept requests', function(done) {
    request.get('/').expect(200, done);
  });

  describe('#create link', function() {
    it('should return a link', function(done) {
      request.post('/?url=http://google.com')
        .expect(200)
        .expect(function(res) {
          res.body.should.have.properties(['url', 'target']);
        }).end(done);
    });

    it('should require a url', function(done) {
      request.post('/').expect(400, done);
    });

    it('should require a valid url', function(done) {
      request.post('/?url=bad!').expect(400, done);
    });

    it('should require a protocol', function(done) {
      request.post('/?url=google.com').expect(400, done);
    });

    it('should not duplicate target urls', function(done) {
      request.post('/?url=http://google.com')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          var u1 = res.body.url;

          request.post('/?url=http://google.com')
            .expect(200)
            .expect(function(res) {
              res.body.url.should.eql(u1);
            }).end(done);
        });
    });
  });

  describe('#claim link', function() {
    var target1 = 'http://google.com';
    var target2 = 'http://google.com';
    var link1, link2;
    before(function(done) {
      request.post('/?url='+target1).expect(200)
        .expect(function(res) {
          link1 = res.body.url;
          link1 = url.parse(link1).path;
        }).end(function(err) {
          if (err) return done(err);

          request.post('/?url='+target2).expect(200)
            .expect(function(res) {
              link2 = res.body.url;
              link2 = url.parse(link2).path;
            }).end(done);
        });
    });

    it('should claim a link', function(done) {
      request.get(link1)
        .expect(302)
        .expect(function(res) {
          res.headers.location.should.eql(target1);
        }).end(done);
    });

    it('should claim the corret target', function(done) {
      request.get(link2)
        .expect(302)
        .expect(function(res) {
          res.headers.location.should.eql(target2);
        }).end(done);
    });

    it('should 404 if it doesn\'t have a link', function(done) {
      request.get('/garbage').expect(404, done);
    });
  });
});