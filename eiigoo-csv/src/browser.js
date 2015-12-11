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

var combine = function (file) {
  return Promise.all([
    readFile(file.taobao).then(loader.taobao),
    readFile(file.zencart).then(loader.zencart)
  ]).then(function (data) {
    return transform({
      taobao: data[0],
      zencart: data[1]
    });
  });
};

exports.combine = combine;
