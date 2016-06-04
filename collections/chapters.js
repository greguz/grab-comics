/**
 * dependencies
 */

var Backbone  = require('backbone'),
    _         = require('lodash');


/**
 * super constructor for this collection
 */

var Super = Backbone.Collection;


/**
 * ChaptersCollection definition
 *
 * @help http://backbonejs.org/#Collection
 */

var ChaptersCollection = Super.extend({


  /**
   * loki.js target collection name
   */

  lokiCollection: 'chapters',


  /**
   * internal model configuration
   *
   * @description specify the model class that the collection contains
   * @help http://backbonejs.org/#Collection-model
   */

  model: require('../models/chapter'),


  /**
   * set field "id" as identifier (instead of "$loki")
   *
   * @description return the value the collection will use to identify a model
   * @help http://backbonejs.org/#Collection-modelId
   */

  modelId: _.property('id'),


  /**
   * sort by chapter's number
   *
   * @description used to maintain the collection in sorted order
   * @help http://backbonejs.org/#Collection-comparator
   */

  comparator: 'number',


  /**
   * triggered on collection creation
   *
   * @description function that will be invoked when the collection is created
   * @help http://backbonejs.org/#Collection-constructor
   */

  initialize: function(models, options) {

    // save parent element
    this.parent = options.parent;

  }


});


/**
 * exports collection
 */

module.exports = ChaptersCollection;
