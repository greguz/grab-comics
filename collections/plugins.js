/**
 * dependencies
 */

var _           = require('underscore')
  , Backbone    = require('backbone')
  , PluginModel = require('../models/plugin');


/**
 * plugin collection definition
 */

var Plugins = Backbone.Collection.extend({


  /**
   * model constructor
   */

  model: PluginModel,


  /**
   * loki.js target collection
   */

  table: 'plugins',


  /**
   * get all available languages
   * @return {Array}
   */

  getLanguages: function() {
    return _.reduce(this.models, function(res, plugin) {
      return _.uniq(res.concat(plugin.get('languages')));
    }, []);
  }


});


/**
 * export constructor
 */

module.exports = Plugins;