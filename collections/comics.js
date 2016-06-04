/**
 * dependencies
 */

var Backbone  = require('backbone'),
    _         = require('lodash');


/**
 * super constructor for ComicsCollection
 */

var Super = Backbone.Collection;


/**
 * ComicsCollection definition
 *
 * @help http://backbonejs.org/#Collection
 */

var ComicsCollection = Super.extend({


  /**
   * loki.js target collection name
   */

  lokiCollection: 'comics',


  /**
   * internal model configuration
   *
   * @description specify the model class that the collection contains
   * @help http://backbonejs.org/#Collection-model
   */

  model: require('../models/comic'),


  /**
   * set field "id" as identifier (instead of "$loki")
   *
   * @description return the value the collection will use to identify a model
   * @help http://backbonejs.org/#Collection-modelId
   */

  modelId: _.property('id'),


  /**
   * sort comics by ID
   *
   * @description used to maintain the collection in sorted order
   * @help http://backbonejs.org/#Collection-comparator
   */

  comparator: 'id',


  /**
   * triggered on collection creation
   *
   * @description function that will be invoked when the collection is created
   * @help http://backbonejs.org/#Collection-constructor
   */

  initialize: function(models, options) {

    // save parent element
    this.parent = options.parent;

  },


  /**
   * TODO write docs
   *
   * @param {String|Array} [title]
   * @param {String|Array} [language]
   * @return {Array}
   */

  match: function(title, language) {

    return this.filter(function(comic) {
      return comic.match(title, language);
    })

  }


});


/**
 * exports collection
 */

module.exports = ComicsCollection;
