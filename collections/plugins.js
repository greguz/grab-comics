/**
 * dependencies
 */

var _           = require('lodash')
  , Backbone    = require('backbone')
  , PluginModel = require('../models/plugin');


/**
 * super constructor for this collection
 */

var Super = Backbone.Collection;


/**
 * plugin collection definition
 */

var PluginsCollection = Super.extend({


  /**
   * internal model configuration
   *
   * @description specify the model class that the collection contains
   * @help http://backbonejs.org/#Collection-model
   */

  model: PluginModel,


  /**
   * get all available languages
   *
   * @return {Array}
   */

  getLanguages: function() {
    return _.reduce(this.models, function(res, plugin) {
      return _.uniq(res.concat(plugin.get('languages')));
    }, []);
  }


});


/**
 * exports collection
 */

module.exports = PluginsCollection;
