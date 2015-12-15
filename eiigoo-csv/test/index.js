var loader = require('../src/core/loader');
var transform = require('../src/core/transform');
var Promise = require('bluebird');
var expect = require('chai').expect;
var fs = Promise.promisifyAll(require('fs'));
var asset = function (path) {
  return fs.readFileAsync(__dirname + '/assets/' + path);
};

describe('loader', function () {
  describe('zencart', function () {
    it('should be formatted', function (done) {
      Promise.all([
          asset('source/zencart.csv').then(loader.zencart),
          asset('expect/zencart.json').then(JSON.parse)
        ])
        .then(function (data) {
          expect(data[0]).to.be.deep.equal(data[1]);
          done();
        })
        .catch(done);
    });
  });
  describe('taobao', function () {
    it('should be formatted', function (done) {
      Promise.all([
          asset('source/taobao.csv').then(loader.taobao),
          asset('expect/taobao.json').then(JSON.parse)
        ])
        .then(function (data) {
          expect(data[0]).to.be.deep.equal(data[1]);
          done();
        })
        .catch(done);
    });
  });
  describe('ioffer', function () {
    it('should be formatted', function (done) {
      Promise.all([
          asset('source/ioffer.csv').then(loader.ioffer),
          asset('expect/ioffer.json').then(JSON.parse)
        ])
        .then(function (data) {
          expect(data[0]).to.be.deep.equal(data[1]);
          done();
        })
        .catch(done);
    });
  });
  describe('wish', function () {
    it('should be formatted', function (done) {
      Promise.all([
          asset('source/wish.xls').then(loader.wish),
          asset('expect/wish.json').then(JSON.parse)
        ])
        .then(function (data) {
          expect(data[0]).to.be.deep.equal(data[1]);
          done();
        })
        .catch(done);
    });
  });
});

describe('transform', function () {
  it('should be fine', function (done) {
    Promise.all([
        asset('source/taobao.csv').then(loader.taobao),
        asset('source/wish.xls').then(loader.wish),
        asset('source/zencart.csv').then(loader.zencart),
        asset('expect/transform.csv')
      ]).then(function (data) {
        return transform({
          taobao: data[0],
          wish: data[1],
          zencart: data[2]
        }, {
          uid: 4310
        }).then(function (result) {
          expect(result).to.be.deep.equal(data[3]);
          done();
        });
      }).catch(done);
  });
});
