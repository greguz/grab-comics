/**
 * dependencies
 */

var _         = require('lodash')
  , Backbone  = require('backbone');


/**
 * super constructor for this collection
 */

var Super = Backbone.Collection;


/**
 * plugin collection definition
 */

var PluginsCollection = Super.extend({


  /**
   * loki.js target collection name
   */

  lokiCollection: 'plugins',


  /**
   * collection's model configuration
   *
   * @description specify the model class that the collection contains
   * @help http://backbonejs.org/#Collection-model
   *
   * @param {Object} [attrs]      raw model attributes
   * @param {Object} [options]    model constructor's options
   * @return {PluginModel}
   */

  model: function(attrs, options) {

    // plugin's constructor
    var PluginModel = require('../models/plugin');

    // get model attributes without functions
    var attributes = _.omitBy(attrs, function(value) {
      return _.isFunction(value);
    });

    // return plugin instance
    return new PluginModel(attributes, options);

  },


  /**
   * get all available languages
   *
   * @param {Object} [query]    query used by Collection#filter
   * @return {Array}
   */

  getLanguages: function(query) {

    // initial reduce value
    var initial = [];

    // reduce definition
    var reduce = function(res, plugin) {
      return _.uniq(res.concat(plugin.get('languages')));
    };

    // array to reduce
    var models = query ? this.filter(query) : this.models;

    // exec reduce
    return _.reduce(models, reduce, initial);

  }


});


/**
 * exports collection
 */

module.exports = PluginsCollection;
