var loader = require('../src/loader');
var transform = require('../src/transform');
var Promise = require('bluebird');
var expect = require('chai').expect;
var fs = require('fs');

describe('transform', function () {
  it('should be fine', function (done) {
    Promise.all([
        loader.zencart(__dirname + '/assets/zencart.csv'),
        loader.taobao(__dirname + '/assets/taobao.csv')
      ]).then(function (data) {
        return transform({
          zencart: data[0],
          taobao: data[1]
        });
      }).then(function (text) {
        var asset = fs.readFileSync(__dirname + '/assets/output.csv');
        expect(text).to.be.deep.equal(asset);
        done();
      }).catch(done);
  });
});
