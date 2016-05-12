/**
 * dependencies
 */

var _           = require('lodash')
  , needle      = require('needle')
  , cheerio     = require('cheerio')
  , Promise     = require('bluebird')
  , Backbone    = require('backbone')
  , util        = require('util')
  , Levenshtein = require('levenshtein');


/**
 * do ajax request
 *
 * @param {String} url                  target url
 * @param {Object} [options]
 * @param {String} [options.method]     request method, default 'GET'
 * @param {Object} [options.headers]    custom request headers
 * @param {String} [options.dataType]   'text', 'json' or 'html', default 'text'
 * @param {Object} [options.data]
 * @return {Promise}
 */

var ajax = function(url, options) {

  options = options || {};

  var agent   = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.73 Safari/537.36'
    , data    = options.data
    , method  = (options.method || 'GET').toLowerCase();

  var needleOptions = {
    headers         : _.extend({ 'User-Agent': agent }, options.headers),
    parse_response  : true,
    decode_response : true
  };

  return new Promise(function(resolve, reject) {
    needle.request(method, url, data, needleOptions, function(err, res) {
      if (err) return reject(err);

      var body = res.body;

      if (options.dataType === 'json') {
        resolve(JSON.parse(body));
      } else if (options.dataType === 'html') {
        resolve(cheerio.load(body));
      } else {
        resolve(body);
      }
    });
  });

};


/**
 * normalize string
 *
 * @param {String...} str   string to normalize
 * @return {String}
 */

var normalize = function(str) {

  // normalize all arguments
  var args = _.map(arguments, function() {

    // converts string, as space separated words, to lower case and replace spaced with "-"
    return _.lowerCase(str).replace(/ /g, '-');

  });

  // return
  return args.join(' ');

};


/**
 * check id two string potentially match
 *
 * @param {String} s1           first string to match
 * @param {String} s2           second string to match
 * @param {Object} [options]
 * @return {Boolean}
 */

var match = function(s1, s2, options) { // TODO fix this

  s1 = normalize(s1);
  s2 = normalize(s2);

  var diff  = Math.abs(s1.length - s2.length)
    , limit = Math.ceil(diff / 5)
    , dist  = (new Levenshtein(s1, s2)).distance;

  return dist <= (diff + limit);

};


/**
 * exports
 */

module.exports = {
  dispatcher  : _.clone(Backbone.Events),
  inherits    : util.inherits,
  ajax        : ajax,
  normalize   : normalize,
  match       : match
};
