'use strict';

var _htmlToArticleJson = require('html-to-article-json');

var _htmlToArticleJson2 = _interopRequireDefault(_htmlToArticleJson);

var _articleJsonToAmp = require('article-json-to-amp');

var _articleJsonToAmp2 = _interopRequireDefault(_articleJsonToAmp);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _requestImageSize = require('request-image-size');

var _requestImageSize2 = _interopRequireDefault(_requestImageSize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var timeout = 5000;

var addDimensions = function addDimensions(json) {
  return _bluebird2.default.all(json.map(function (row) {
    var embedType = row.embedType;
    var width = row.width;
    var height = row.height;
    var src = row.src;

    if (embedType !== 'image' || width && height || !src) {
      return row;
    }

    return new _bluebird2.default(function (resolve, reject) {
      (0, _requestImageSize2.default)({ uri: src, timeout: timeout }, function (err, dimensions) {
        if (err) {
          reject(err);
        } else {
          row.width = dimensions.width;
          row.height = dimensions.height;
          resolve(row);
        }
      });
    });
  }));
};

module.exports = function () {
  var htmlToArticleJson = (0, _htmlToArticleJson2.default)();

  var htmlToAmp = function htmlToAmp(html) {
    return _bluebird2.default.resolve(htmlToArticleJson(html)).then(function (json) {
      return addDimensions(json);
    }).then(function (json) {
      return _bluebird2.default.resolve((0, _articleJsonToAmp2.default)(json));
    });
  };

  return function (html, cb) {
    if (cb) {
      htmlToAmp(html).then(function (amp) {
        return cb(null, amp);
      }, function (err) {
        return cb(err);
      });
    } else {
      return htmlToAmp(html);
    }
  };
};