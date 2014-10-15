var mangle = require('../lib/mangle');

describe('mangle', function() {
  describe('#constructor', function() {
    it('should not need any params', function() {
      var m = mangle();
      m.alphabet.should.equal('0123456789');
    });

    it('should not allow alphabets with less that 1 character', function() {
      (function() { mangle('a'); }).should.throw();
    });

    it('should allow any other alphabet', function() {
      var m = mangle('asdf');
      m.alphabet.should.equal('asdf');
    });
  });

  describe('#encode', function() {
    it('should encode a value', function() {
      mangle().encode(123).should.equal('123');
      mangle().encode(123).should.be.a.String;
    });

    it('should encode using the alphabet', function() {
      mangle('01').encode(4).should.eql('100');
      mangle('ab').encode(4).should.eql('baa');
    });

    it('should encode binary correctly', function() {
      var m = mangle('01');
      m.encode(0).should.eql('0');
      m.encode(1).should.eql('1');
      m.encode(2).should.eql('10');
      m.encode(9999).should.eql('10011100001111');
    });

    it('should encode hex correctly', function() {
      var m = mangle('0123456789abcdef');
      m.encode(0).should.eql('0');
      m.encode(1).should.eql('1');
      m.encode(2).should.eql('2');
      m.encode(10).should.eql('a');
      m.encode(16).should.eql('10');
      m.encode(9999).should.eql('270f');
    });
  });

  describe('#decode', function() {
    it('should decode a string', function() {
      mangle().decode('123').should.eql(123);
      mangle().decode('123').should.be.a.Number;
    });

    it('should decode using the alphabet', function() {
      mangle('01').decode('10').should.eql(2);
    });

    it('should decode binary correctly', function() {
      var m = mangle('01');
      m.decode('0').should.eql(0);
      m.decode('1').should.eql(1);
      m.decode('10').should.eql(2);
      m.decode('10011100001111').should.eql(9999);
    });

    it('should decode hex correctly', function() {
      var m = mangle('0123456789abcdef');
      m.decode('0').should.eql(0);
      m.decode('1').should.eql(1);
      m.decode('2').should.eql(2);
      m.decode('a').should.eql(10);
      m.decode('10').should.eql(16);
      m.decode('270f').should.eql(9999);
    });

    it('should decode its output', function() {
      var m = mangle('abcd123');
      [1,10,99,12374].forEach(function(n) {
        m.decode(m.encode(n)).should.eql(n);
      });
    });
  });
});