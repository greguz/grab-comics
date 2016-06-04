/**
 * dependencies
 */

var _       = require('lodash'),
    async   = require('async'),
    utils   = require('./utils'),
    plugin  = require(process.argv[2]);


/**
 * utility for error notification to parent process
 *
 * @param {Function} [callback]   callback
 * @param {*} [context]           context where execute callback
 * @return {Function}
 */

var handleError = function(callback, context) {

  // return standard callback function
  return function(err) {

    // send error to parent process via intercom
    if (err) process.parent.emit('plugin::error', _.pick(err, 'message', 'stack'));

    // execute callback on specified context passing all arguments
    if (_.isFunction(callback)) callback.apply(context, arguments);

  };

};


/**
 * API registration
 */

process.parent.on('plugin::searchByTitle', function(title, languages) {

  var match = function(str) {
    return utils.match(title, str);
  };

  var add = function(comic) {
    process.parent.emit('plugin::searchByTitle::match', comic);
  };

  var done = handleError(function() {
    process.parent.emit('plugin::searchByTitle::done');
  });

  var tasks = _.map(languages, function(language) {
    return function(callback) {
      plugin.searchByTitle(match, language, add, handleError(callback));
    };
  });

  async.parallel(tasks, done);

});

process.parent.on('plugin::loadChapters', function(comic) {

  var add = function(chapter) {
    process.parent.emit('plugin::loadChapters::match', chapter);
  };

  var done = handleError(function() {
    process.parent.emit('plugin::loadChapters::done');
  });

  var tasks = [
    function(callback) {
      plugin.loadChapters(comic, add, handleError(callback));
    }
  ];

  async.parallel(tasks, done);

});

process.parent.on('plugin::loadPages', function(chapter) {

  var add = function(page) {
    process.parent.emit('plugin::loadPages::match', page);
  };

  var done = handleError(function() {
    process.parent.emit('plugin::loadPages::done');
  });

  var tasks = [
    function(callback) {
      plugin.loadPages(chapter, add, handleError(callback));
    }
  ];

  async.parallel(tasks, done);

});
