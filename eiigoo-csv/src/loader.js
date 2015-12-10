var _ = require('underscore');
var csv = require('csv');
var Promise = require('bluebird');
var iconv = require('iconv-lite');
var fs = Promise.promisifyAll(require('fs'));

var taobao = function (path) {
  return fs.readFileAsync(path)
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

var zencart = function (path) {
  return fs.readFileAsync(path)
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
