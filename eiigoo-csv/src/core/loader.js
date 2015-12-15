var _ = require('underscore');
var csv = require('csv');
var Promise = require('bluebird');
var iconv = require('iconv-lite');
var xls = require('xlsjs');

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

var wish = function (buffer) {
  return Promise.resolve(buffer)
    .then(function (buffer) {
      return xls.utils.sheet_to_json(xls.read(buffer).Sheets.Cells);
    });
};

exports.taobao = taobao;
exports.zencart = zencart;
exports.ioffer = ioffer;
exports.wish = wish;
