/**
 * dependencies
 */

var utils             = require('./utils')
  , PluginsCollection = require('../collections/plugins');


/**
 * create collection and add plugins
 */

var plugins = new PluginsCollection([

  require('../plugins/mangaeden')

]);

// wait for store initialization
utils.dispatcher.on('store:ready', function() {

  // fetch options
  var options = {
    remove: false
  };

  // fetch plugin status
  plugins.fetch(options).catch(function(err) {

    // notify error
    console.error(err.stack || err.toString()); // TODO notify error to user (using bootstrap-notify ?)

  });

});


/**
 * exports
 */

module.exports = plugins;
