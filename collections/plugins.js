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
   * collection's model configuration
   *
   * @description specify the model class that the collection contains
   * @help http://backbonejs.org/#Collection-model
   *
   * @param {Object} attrs                    raw model attributes
   * @param {String} attrs.id                 unique id for plugin identification
   * @param {Array} attrs.languages           available languages for this plugin
   * @param {String} [attrs.url]              website url for credits
   * @param {String} [attrs.name]             label used by GUI, default from ID
   * @param {String} [attrs.thumbnail]        thumbnail image used into gallery
   * @param {String} [attrs.description]      short plugin description
   * @param {String} [attrs.credits]          plugin creator credits
   * @param {Function} [attrs.searchComics]
   * @param {Function} [attrs.loadChapters]
   * @param {Function} [attrs.loadPages]
   * @param {Object} [options]                model constructor's options
   * @return {PluginModel}
   */

  model: function(attrs, options) {

    // extend PluginModel with private functions
    var Plugin = PluginModel.extend({
      _searchComics: attrs.searchComics,
      _loadChapters: attrs.loadChapters,
      _loadPages: attrs.loadPages
    });

    // get real model attributes
    var attributes = _.omit(attrs, 'searchComics', 'loadChapters', 'loadPages');

    // return plugin instance
    return new Plugin(attributes, options);

  },


  /**
   * get all available languages
   *
   * @return {Array}
   */

  getLanguages: function() {

    var initial = [];

    var reduce = function(res, plugin) {

      var languages = plugin.get('languages');

      return _.uniq(res.concat(languages));

    };

    return _.reduce(this.models, reduce, initial);

  }


});


/**
 * exports collection
 */

module.exports = PluginsCollection;
