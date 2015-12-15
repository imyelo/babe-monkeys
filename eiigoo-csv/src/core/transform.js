var _ = require('underscore');
var csv = require('csv');
var iconv = require('iconv-lite');
var Promise = require('bluebird');

var HEADER = 'version 1.00';
var IMAGE_PATH = 'http://www.eiigoo.com/union/shopimg/user_img/<%- uid %>/taobao/';

var transform = module.exports = function (source, options) {
  return Promise.resolve()
    .then(function () {
      // 合并数据
      var zencart = source.zencart;
      var taobao = source.taobao;
      var wish = source.wish;
      return _.map(taobao, function (item, index) {
        var zen = zencart[index];
        var description = zen['v_products_description_1'];
        description = description.replace(/(src=")(images\/\d+\/)(\w+\.jpg"\/>)/g, '$1' + _.template(IMAGE_PATH)({
          uid: options.uid
        }) + '$3');
        return _.extend({}, item, {
          title: wish[index]['Product Name1'] || zen['v_products_name_1'],
          description: description
        });
      });
    }).then(function (items) {
      // 转换为 csv 结构
      var keys = _.keys(items[0]);
      var length = keys.length;
      var header = _.chain(length - 1).range().map(function () { return ''; }).value();
      header.unshift(HEADER);
      return [header, keys, keys].concat(_.map(items, _.values));
    }).then(function (sheet) {
      // 转换为文本
      return Promise.promisify(csv.stringify)(sheet, {
        delimiter: '\t'
      });
    }).then(function (text) {
      // 转换为 gbk 编码
      return iconv.encode(text, 'gbk');
    });
};
