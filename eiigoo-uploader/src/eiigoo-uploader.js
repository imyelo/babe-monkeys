var $ = require('jquery');
var Promise = require('bluebird');
var Upload = require('component-upload');
var cookie = require('component-cookie');
var nprogress = require('nprogress');

var sessionId = cookie('sessionID');
var isUploading = false;
var $files, $commit;

var each = require('foreach');
var reduce = require('reduce');

var services = {
  upload: function (file) {
    return new Promise(function (resolve, reject) {
      var upload = new Upload(file);
      upload.to({
        data: {
          Filename: file.name,
          Upload: 'Submit Query'
        },
        name: 'userfile',
        path: '/taobao_upload.php?taobao=upload&sessionID=' + sessionId
      });
      upload.on('error', function (err) {
        reject(err);
      });
      upload.on('end', function (req) {
        resolve(req);
      });
    });
  }
};

var init = function () {
  $files = $('<input type="file" multiple>').appendTo('.mem_right');
  $commit = $('<a href="javascript:void 0;">上传</a>').appendTo('.mem_right');
  $commit.click(function () {
    var files = $files[0].files;
    var length = files.length;
    if (isUploading) {
      return;
    }
    $commit.text('uploading...');
    isUploading = true;
    nprogress.start();

    reduce(files, function (queue, file) {
      return queue.then(function () {
        nprogress.inc(1 / length);
        return services.upload(file);
      });
    }, Promise.resolve()).then(function () {
      alert(length + '个文件上传成功.');
      isUploading = false;
      nprogress.done();
      $commit.text('上传');
    }).catch(function (err) {
      alert(err.message || err);
    });
  });
};

init();
