require('whatwg-fetch');

var Promise = require('bluebird');
var ec = require('./browser');

var CONSTANT = {
  FILE_FIELD_NAME: 'csv_file'
};

var uid = $('#header .top1_bg .span_right .tnav .red').attr('href').match(/(\d+)$/)[1];

var $form = $('div.mem_right > form').eq(0);

var $container = $('<td>');
var $taobao = $('<input type="file">');
var $wish = $('<input type="file">');
var $zencart = $('<input type="file">');
var $preview = $('<div>');

var $combine = $('<a>').attr('href', 'javascript: void 0;').text('合并').css({
  background: '#333',
  color: '#eee',
  padding: '6px 12px',
  'border-radius': '4px'
});

var $confirm = $('<a>').attr('href', 'javascript: void 0;').text('使用合并的文件上传').css({
  background: '#111',
  color: '#eee',
  padding: '6px 12px',
  'border-radius': '4px'
});

var cache = {};

var combine = function () {
  return ec.combine({
      taobao: $taobao.get(0).files[0],
      wish: $wish.get(0).files[0],
      zencart: $zencart.get(0).files[0]
    }, {
      uid: uid
    })
    .then(function (buffer) {
      $preview.empty();
      $('<a>').appendTo($preview).css('margin', '24px').text('预览').attr('href', 'data:text/plain;base64,' + buffer.toString('base64')).attr('target', '_blank');
      $('<a>').appendTo($preview).css('margin', '24px').text('下载').attr('href', 'data:text/plain;base64,' + buffer.toString('base64')).attr('download', 'combine.csv');
      return new File([buffer], 'combine.csv');
    })
    .then(function (file) {
      cache.file = file;
      return file;
    })
    .catch(function(err) {
      console.error(err);
      alert(err);
    });
};

$container
  .append($('<p>').append($('<label>淘宝: </label>').append($taobao)))
  .append($('<p>').append($('<label>wish: </label>').append($wish)))
  .append($('<p>').append($('<label>zencart: </label>').append($zencart)))
  .append($('<p>').append($combine))
  .append($('<p>').append($confirm))
  .append($preview)
  .appendTo($('<tr><td>合并上传</td></tr>').appendTo($form.find('tbody')))
  .css('line-height', '36px');

$combine.click(combine);

$confirm.click(function () {
  (cache.file ? Promise.resolve(cache.file) : combine())
    .then(function (file) {
      var params = $form.serializeArray();
      var form = new FormData();
      params.forEach(function (param) {
        form.append(param.name, param.value);
      });
      form.append(CONSTANT.FILE_FIELD_NAME, file);
      return fetch(window.location.href, {
        method: 'post',
        body: form,
        credentials: 'same-origin'
      })
    })
    .then(function (response) {
      return response.text();
    })
    .then(function (body) {
      if (body.match(/导入成功/)) {
        alert('导入成功');
        window.location.reload();
      } else {
        alert('响应有异常');
      }
    })
    .catch(function(err) {
      console.error(err);
      alert(err);
    });
});
