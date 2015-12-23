var _ = require('lodash');
var path = require('path');
var md5 = require('md5');
var urllib = require('urllib');
var cheerio = require('cheerio');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs-extra'));
var csv = require('csv');
var iconv = require('iconv-lite');
var prettyHrtime = require('pretty-hrtime');

var TaobaoAdaptor = require('./adaptor/taobao');

var cache = function (filename, buffer) {
  var thePath = path.resolve(__dirname, '../.cache/', filename);
  return fs.writeFileAsync(thePath, buffer).then(function () {
    return thePath;
  });
};

var service = {
  description: function (id) {
    return urllib.request('http://desc.aliexpress.com/getDescModuleAjax.htm?productId=' + id)
      .then(function (result) {
        return result.data.toString();
      })
      .then(function (text) {
      return text.replace(/^\s*window.productDescription='(.*)';\s*$/, '$1');
    });
  },
  image: function (url) {
    return urllib.request(url).then(function (result) {
      return {
        url: url,
        buffer: result.data
      };
    }).then(function (image) {
      image.md5 = md5(image.buffer).toUpperCase();
      image.filename = image.md5 + '.jpg';
      return cache(image.filename, image.buffer).then(function (path) {
        image.path = path;
        return image;
      });
    });
  },
  images: function (urls) {
    return Promise.all(_.map(urls, service.image));
  }
};

var fetch = function (url, options) {
  var startAt = process.hrtime();
  return urllib.request(url)
    .then(function (result) {
      return result.data.toString();
    })
    .then(function (html) {
      var $ = cheerio.load(html);
      var images = $('#img .image-nav-item img').map(function () {
        return $(this).attr('src').replace(/_50x50.jpg$/, '');
      }).get();
      return {
        id: $('#hid-product-id').val(),
        title: $('#base > div.col-main h1').text(),
        price: html.match(/window.runParams.minPrice="([\d\.]+)"/)[1],
        images: images,
        caches: []
      };
    })
    .then(function (item) {
      return service.images(item.images).then(function (images) {
        item.images = images;
        item.caches = item.caches.concat(images);
        return item;
      });
    })
    .then(function (item) {
      return service.description(item.id).then(function (description) {
        item.description = description;
        return item;
      });
    })
    .then(function (item) {
      var $ = cheerio.load(item.description);
      return Promise.all($('img').map(function () {
        var $el = $(this);
        return service.image($el.attr('src')).then(function (image) {
          $el.attr('src', 'http://www.eiigoo.com/union/shopimg/user_img/' + options.uid + '/taobao/' + image.filename);
          item.caches.push(image);
        });
      }).get()).then(function () {
        $('a').attr('href', '');
        item.description = $.html();
        return item;
      });
    })
    .then(function (item) {
      console.log('url: %s', url);
      console.log('1 item with %s images cached', item.caches.length);
      console.log('cost %s', prettyHrtime(process.hrtime(startAt)));
      return item;
    });
};

var init = function (options) {
  urllib.TIMEOUT = options.timeout;
  return fs.ensureDirAsync(path.resolve(__dirname, '../.cache/'));
};

module.exports = function (urls, options) {
  options = _.defaults(options, {
    timeout: 30000,
    concurrency: 1,
    uid: 0
  });
  return init(options)
    .then(function () {
      return Promise.map(urls, function (url) {
        return fetch(url, {
          uid: options.uid
        });
      }, {
        concurrency: options.concurrency
      });
    })
    .then(function (items) {
      return Promise.promisify(csv.stringify)(_.map(items, function (item) {
        return TaobaoAdaptor.fromAliexpress.transfer(item);
      }), {
        delimiter: '\t'
      }).then(function (text) {
        return fs.readFileAsync(path.resolve(__dirname, './template/taobao.csv')).then(function (template) {
          return template + text;
        });
      }).then(function (text) {
        return {
          items: items,
          csv: iconv.encode(text, 'gbk')
        };
      });
    })
    .catch(function (err) {
      console.error(err.stack);
      console.error(err);
    });
};
