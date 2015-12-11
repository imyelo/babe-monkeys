var ec = require('../src/browser');

$(function() {
  $('.btn-combine').on('click', function() {
    ec.combine({
        taobao: $('.input-taobao').get(0).files[0],
        zencart: $('.input-zencart').get(0).files[0]
      }, {
        uid: $('.input-uid').val()
      })
      .then(function (buffer) {
        $('<a>').appendTo('.result').addClass('download').text('点击下载').attr('href', 'data:text/plain;base64,' + buffer.toString('base64')).attr('download', 'output.csv');
        return new File([buffer], 'output.csv');
      })
      .catch(function(err) {
        console.error(err);
        alert(err);
      });
  });
  $('.btn-clear').on('click', function () {
    $('.result').empty();
  });
});
