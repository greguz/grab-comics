/**
 * dependencies
 */

var _           = require('lodash')
  , superagent  = require('superagent')
  , cheerio     = require('cheerio')
  , path        = require('path')
  , sanitize    = require('sanitize-filename')
  , Promise     = require('bluebird')
  , Backbone    = require('backbone')
  , util        = require('util')
  , Levenshtein = require('levenshtein');


/**
 * global events dispatcher
 */

var dispatcher = _.clone(Backbone.Events);


/**
 * do ajax request
 *
 * @param {String} url                  target url
 * @param {Object} [options]
 * @param {String} [options.method]     request method, default 'GET'
 * @param {Object} [options.headers]    custom request headers
 * @param {String} [options.dataType]   'text', 'json', 'binary' or 'html', default 'text'
 * @param {Object} [options.data]
 * @return {Promise}
 */

var ajax = function(url, options) {

  // set default options
  options = _.defaults(options, {

    // request method
    method: 'GET',

    // expected response type
    dataType: 'text',

    // custom request headers
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.73 Safari/537.36'
    }

  });

  // ensure method upper cased
  options.method = options.method.toUpperCase();

  // create agent
  var agent = superagent(options.method, url);

  // set request headers
  agent.set(options.headers);

  // requests json response
  if (options.dataType === 'json') agent.accept('json');

  // if binary request add parsing middleware
  if (options.dataType === 'binary') agent.parse(function(res, callback) {

    // set encoding
    res.setEncoding('binary');

    // set initial data
    res.data = '';

    // listen for incoming data
    res.on('data', function (chunk) {
      res.data += chunk;
    });

    // listen for request end
    res.on('end', function () {
      callback(null, new Buffer(res.data, 'binary'));
    });

  });

  // return new promise
  return new Promise(function(resolve, reject) {

    // send request
    agent.end(function(err, res) {

      // reject promise on error
      if (err) return reject(err);

      // response
      var body = res.body;

      // parse response (options.dataType)
      if (options.dataType === 'json') {

        // parse JSON
        if (_.isString(body)) body = JSON.parse(body);

      } else if (options.dataType === 'html') {

        // instance cheerio (like jQuery)
        body = cheerio.load(res.text);

      } else if (options.dataType === 'binary') {

        // get response buffer
        body = res.data;

      }

      // resolve promise
      resolve(body);

    });

  });

};


/**
 * normalize string
 *
 * @param {String} str                  string to normalize
 * @param {Object} [options]
 * @param {Object} [options.replace]    replace char for invalid ones, default '-'
 * @return {String}
 */

var normalize = function(str, options) {

  // set default options
  options = _.defaults(options, {
    replace: '-'
  });

  // normalize string
  return _.lowerCase(str).replace(/ /g, options.replace);

};


/**
 * get Levenshtein distance between two string
 *
 * @param {String} s1                     first string to match
 * @param {String} s2                     second string to match
 * @param {Object} [options]
 * @param {Boolean} [options.normalize]   normalize strings before matching, default true
 * @returns {Number}
 */

var distance = function(s1, s2, options) {

  // set default options
  options = _.defaults(options, {
    normalize: true
  });

  // normalize input strings
  if (options.normalize === true) {
    s1 = normalize(s1);
    s2 = normalize(s2);
  }

  // return Levenshtein distance between string
  return (new Levenshtein(s1, s2)).distance;

};


/**
 * check id two string potentially match using Levenshtein
 *
 * @help https://en.wikipedia.org/wiki/Levenshtein_distance
 * @help https://github.com/gf3/Levenshtein
 *
 * @param {String} s1   first string to match
 * @param {String} s2   second string to match
 * @return {Boolean}
 */

var match = function(s1, s2) {

  // normalize string
  s1 = normalize(s1, { replace: '' });

  // normalize string
  s2 = normalize(s2, { replace: '' });

  // get shortest string
  var min = s2.length < s1.length ? s2 : s1;

  // get longest string
  var max = s2.length >= s1.length ? s2 : s1;

  // result var
  var match = false;

  // Levenshtein distance limit (for each word)
  var limit = min.length / 5;

  // each all chars
  for (var i = 0; i < max.length && !match; i++) {

    // create new string from "max" long as "min"
    var s3 = max.substr(i, min.length);

    // check if they are exactly equal
    if (s3.length === min.length) {

      // calculate Levenshtein distance between string
      var dist = distance(s3, min, { normalize: false });

      // check distance
      match = match || (dist <= limit);

    }

  }

  // return result var
  return match;

};


/**
 * map events to global dispatcher
 *
 * @param {*} obj                 object to listen
 * @param {String} prefix         global event prefix
 * @param {Array|Object} events   events to map
 */

var mapEvents = function(obj, prefix, events) {

  // each all events
  _.each(events, function(ev, map) {

    // set listener
    obj.on(ev, function() {

      // global dispatcher event
      var global = prefix + ':' + (_.isNumber(map) ? ev : map);

      // global trigger arguments
      var args = [ global ].concat(_.values(arguments));

      // trigger global event
      dispatcher.trigger.apply(dispatcher, args);

    });

  });

};


/**
 * join and sanitize fs paths
 *
 * @param {String..} p    file or folder path/name
 * @return {String}
 */

var getPath = function(p) {

  // if first argument is absolute
  var isAbsolute = path.isAbsolute(p);

  // initial reduce value
  var initial = [];

  // reduce definition
  var reduce = function(result, arg) {

    // split path into parts
    var parts = arg.split(path.sep);

    // sanitize all parts
    var sanitized = _.map(parts, function(part) {

      // return sanitized file/directory name
      return sanitize(part, { replacement: '' });

    });

    // concat parts to reduce result
    return result.concat(sanitized);

  };

  // execute reduce on arguments
  var parts = _.reduce(arguments, reduce, initial);

  // get resulting path (join all parts)
  var result = path.join.apply(path, parts);

  // return result
  return (isAbsolute ? path.sep : '') + result;

};


/**
 * get user's home directory
 *
 * @return {String}
 */

var homeDir = function() {

  // return home directory by platform env vars (thanks windows...)
  return process.env[ (process.platform == 'win32') ? 'USERPROFILE' : 'HOME' ];

};


/**
 * exports
 */

module.exports = {
  dispatcher  : dispatcher,
  inherits    : util.inherits,
  ajax        : ajax,
  normalize   : normalize,
  match       : match,
  mapEvents   : mapEvents,
  getPath     : getPath,
  distance    : distance,
  homeDir     : homeDir
};
