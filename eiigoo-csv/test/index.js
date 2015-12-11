var loader = require('../src/core/loader');
var transform = require('../src/core/transform');
var Promise = require('bluebird');
var expect = require('chai').expect;
var fs = Promise.promisifyAll(require('fs'));

describe('transform', function () {
  it('should be fine', function (done) {
    Promise.all([
        fs.readFileAsync(__dirname + '/assets/zencart.csv').then(loader.zencart),
        fs.readFileAsync(__dirname + '/assets/taobao.csv').then(loader.taobao),
        fs.readFileAsync(__dirname + '/assets/output.csv')
      ]).then(function (data) {
        return transform({
          zencart: data[0],
          taobao: data[1]
        }).then(function (result) {
          expect(result).to.be.deep.equal(data[2]);
          done();
        });
      }).catch(done);
  });
});
