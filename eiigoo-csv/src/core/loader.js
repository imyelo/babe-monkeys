var _ = require('underscore');
var csv = require('csv');
var Promise = require('bluebird');
var iconv = require('iconv-lite');

var taobao = function (buffer) {
  return Promise.resolve(buffer)
    .then(_.partial(iconv.decode, _, 'utf16'))
    .then(_.partial(Promise.promisify(csv.parse), _, {
      delimiter: '\t'
    }))
    .then(function (sheet) {
      var titles = sheet[1];
      return _.map(sheet.slice(3), function (data) {
        return _.object(titles, data);
      });
    });
};

var zencart = function (buffer) {
  return Promise.resolve(buffer)
    .then(Promise.promisify(csv.parse))
    .then(function (sheet) {
      var titles = sheet[0];
      return _.map(sheet.slice(1), function (data) {
        return _.object(titles, data);
      });
    });
};

var ioffer = function (buffer) {
  return Promise.resolve(buffer)
    .then(Promise.promisify(csv.parse))
    .then(function (sheet) {
      var titles = sheet[0];
      return _.map(sheet.slice(1), function (data) {
        return _.object(titles, data);
      });
    });
};

exports.taobao = taobao;
exports.zencart = zencart;
exports.ioffer = ioffer;
