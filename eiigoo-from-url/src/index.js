var SOURCE = 'http://www.aliexpress.com/item/MXV-Quad-Core-Android-TV-BOX-S805-1GB-8GB-Cortex-1-5-GHZ-Android-4-4/32410246749.html?spm=2114.01010108.3.1.j1CDlx&ws_ab_test=searchweb201556_7,searchweb201644_0_79_78_77_82_80_62,searchweb201560_3';

var request = require('superagent');
var cheerio = require('cheerio');
var Promise = require('bluebird');

var service = {
  description: function (id) {
    return new Promise(function (resolve, reject) {
      request.get('http://desc.aliexpress.com/getDescModuleAjax.htm?productId=32410246749')
        .end(function (err, res) {
          if (err) {
            return reject(err);
          }
          resolve(res.text);
        });
    }).then(function (text) {
      return text.replace(/^\s*window.productDescription='(.*)';\s*$/, '$1');
    });
  }
};

var fetch = function (url) {
  return new Promise(function (resolve, reject) {
    request
      .get(url)
      .end(function (err, res) {
        if (err) {
          return reject(err);
        }
        resolve(res.text);
      });
  }).then(function (html) {
    var $ = cheerio.load(html);
    var images = $('#img .image-nav-item img').map(function () {
      return $(this).attr('src').replace(/_50x50.jpg$/, '');
    }).get();
    return {
      id: $('#hid-product-id').val(),
      title: $('#base > div.col-main h1').text(),
      price: html.match(/window.runParams.minPrice="([\d\.]+)"/)[1],
      images: images
    };
  }).then(function (data) {
    return service.description(data.id).then(function (description) {
      data.description = description;
      return data;
    });
  });
};

fetch(SOURCE)
  .then(function (data) {
    console.log(data);
  });
