
import 'should';
import convertToFrontEnd, {getTabs, convertToFrontEndRaw} from '../src';

describe('MemoryToString', function() {
  let complex = {
    a: 5,
    b: [true, 'happy', {d: 3}],
    c: function() {
      return 3;
    }
  };
  let complexResult = '{\n  a: 5,\n  b: [\n    true,\n    \'happy\',\n' +
    '    {\n      d: 3\n    }\n  ],\n  c: function c() {\n    return 3;\n  }\n}';
  describe('getTabs', function() {
    it('should get one tab', function() {
      getTabs(1).should.equal('  ');
    });
    it('should get four tabs', function() {
      getTabs(4).should.equal('        ');
    });
  });
  describe('convert raw', function() {
    it('should convert raw data', function() {
      convertToFrontEndRaw(undefined).should.eql('undefined');
      convertToFrontEndRaw(5).should.eql('5');
      convertToFrontEndRaw(true).should.eql('true');
      convertToFrontEndRaw('happy').should.eql('\'happy\'');
      convertToFrontEndRaw('hap\'py').should.eql('\'hap\\\'py\'');
    });
    it('should convert functions', function() {
      convertToFrontEndRaw(function happyDay(happy, day) {
        return happy + day;
      }).should.eql('function happyDay(happy, day) {\n  return happy + day;\n}');
    });
    it('should convert arrays', function() {
      convertToFrontEndRaw([1, 2, 'happy']).should.eql('[\n  1,\n  2,\n  \'happy\'\n]');
    });
    it('should convert complex objects', function() {
      convertToFrontEndRaw(complex).should.eql(complexResult);
    });
    it('should evaluated to true javascript', function() {
      let result;
      eval('result = ' + convertToFrontEndRaw(complex));
      result.should.have.property('a', 5);
      result.b.should.eql(complex.b);
      complex.c().should.eql(3);
    });
  });
  describe('convertToFrontEnd', function() {
    it('should save to a namespace', function() {
      convertToFrontEnd(complex, 'namespace').should.eql(`namespace = ${complexResult};\n`);
    });
  });
});
