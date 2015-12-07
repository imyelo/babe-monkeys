var request = require('superagent');
var cheerio = require('cheerio');

var URL = 'http://www.tmart.com/RC-Helicopters-Accessories-205gallery/';

var list = function (url) {
  request.get(url)
  	.end(function (err, res) {
      if (err) {
      	return console.error(err);
      }
      console.log(res);
      console.log(res.text);
  	});
};

list(URL);
