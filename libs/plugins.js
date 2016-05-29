/**
 * dependencies
 */

var requireDir        = require('require-dir')
  , _                 = require('lodash')
  , PluginsCollection = require('../collections/plugins');


/**
 * plugins initialization
 */

// require plugins dir
var required = requireDir('../plugins');

// create plugins collection
var plugins = new PluginsCollection(_.values(required));

// fetch cached plugins
plugins.fetch({ remove: false });


/**
 * exports
 */

module.exports = plugins;
