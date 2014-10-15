module.exports = function(alphabet) {
  if (alphabet && alphabet.length < 2) throw new Error('Alphabet not long enough');

  return {
    alphabet: alphabet || '0123456789',
    decoder: null,

    encode: function(value) {
      var base = this.alphabet.length;
      var output = '';
      var digit;

      if (value === 0) return this.alphabet[0];

      while (value > 0) {
        digit = value % base;
        output = this.alphabet[digit] + output;
        value = (value - digit) / base;
      }
      return output;
    },

    decode: function(string) {
      var len = string.length;
      var base = this.alphabet.length;

      // Build decoder if needed
      if (!this.decoder) {
        var d = {};
        this.alphabet.split('').forEach(function(c, i) { d[c] = i; });
        this.decoder = d;
      }
      
      var i, output = 0;
      for (i=0; i<len; i++) {
        output *= base;
        output += this.decoder[string[i]];
      }
      return output;
    }
  };
};