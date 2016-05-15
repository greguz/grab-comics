

var utils             = require('./utils')
  , PluginsCollection = require('../collections/plugins');


var plugins = new PluginsCollection([
  require('../plugins/mangaeden')
]);

utils.dispatcher.on('store:ready', function() {

  plugins.fetch().catch(function(err) {

    console.error(err.stack); // TODO log error to user (using bootstrap-notify ?)

  });

});



module.exports = plugins;
