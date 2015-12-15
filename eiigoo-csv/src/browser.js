var _ = require('underscore');
var Promise = require('bluebird');

var transform = require('./core/transform');
var loader = require('./core/loader');

var readFile = function (file) {
  return new Promise(function (resolve, reject) {
    var reader = new window.FileReader();
    reader.readAsBinaryString(file);
    reader.onload = _.once(function(e) {
      resolve(reader.result);
    });
  });
};

var combine = function (file, options) {
  return Promise.all([
    readFile(file.taobao).then(loader.taobao),
    readFile(file.wish).then(loader.wish),
    readFile(file.zencart).then(loader.zencart)
  ]).then(function (data) {
    return transform({
      taobao: data[0],
      wish: data[1],
      zencart: data[2]
    }, options);
  });
};

exports.combine = combine;
