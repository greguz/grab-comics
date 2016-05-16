/**
 * dependencies
 */

var _           = require('lodash')
  , needle      = require('needle')
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
 * @param {String} s1                     first string to match
 * @param {String} s2                     second string to match
 * @param {Object} [options]
 * @param {Boolean} [options.normalize]   normalize strings before matching, default true
 * @return {Boolean}
 */

var match = function(s1, s2, options) {

  // set default options
  options = _.defaults(options, {
    normalize: true
  });

  // normalize input strings
  if (options.normalize === true) {
    s1 = normalize(s1);
    s2 = normalize(s2);
  }

  // get length difference between strings
  // this is the minimum value resulting from Levenshtein distance
  var difference = Math.abs(s1.length - s2.length);

  // calculate Levenshtein distance between string
  var distance = (new Levenshtein(s1, s2)).distance;

  // set matching limit
  var limit = Math.ceil(difference / 5); // 80% // TODO set matching limit from options

  // return matching result
  return distance <= (distance + limit);

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
