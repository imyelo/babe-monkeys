require('whatwg-fetch');

var ec = require('./browser');

var CONSTANT = {
  FILE_FIELD_NAME: 'csv_file'
};

var $form = $('div.mem_right > form').eq(0);

var $container = $('<td>');
var $taobao = $('<input type="file">');
var $zencart = $('<input type="file">');
var $preview = $('<div>');

var $confirm = $('<a>').attr('href', 'javascript: void 0;').text('确认上传').css({
  background: '#111',
  color: '#eee',
  padding: '6px 12px',
  'border-radius': '4px'
});

$container.append($('<label>淘宝</label>').append($taobao)).append($('<label>zencart</label>').append($zencart)).append($confirm).append($preview).appendTo($('<tr><td>合并上传</td></tr>').appendTo($form.find('tbody')));

$confirm.click(function () {
  ec.combine({
      taobao: $taobao.get(0).files[0],
      zencart: $zencart.get(0).files[0]
    })
    .then(function (buffer) {
      $preview.empty();
      $('<a>').appendTo($preview).addClass('download').text('预览').attr('href', 'data:text/plain;base64,' + buffer.toString('base64')).attr('target', '_blank');
      return new File([buffer], 'combine.csv');
    })
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
