/**
 * dependencies
 */

var Backbone      = require('backbone')
  , ChapterModel  = require('../models/chapter');


/**
 * super constructor for this collection
 */

var Super = Backbone.Collection;


/**
 * ChaptersCollection definition
 * @help http://backbonejs.org/#Collection
 */

var ChaptersCollection = Super.extend({


  /**
   * internal model configuration
   *
   * @description specify the model class that the collection contains
   * @help http://backbonejs.org/#Collection-model
   */

  model: ChapterModel,


  /**
   * set field "id" ad ideintificator (instead of "$loki")
   *
   * @description return the value the collection will use to identify a model
   * @help http://backbonejs.org/#Collection-modelId
   *
   * @param {Object} attrs    model attributes
   * @return {String}
   */

  modelId: function(attrs) {
    return attrs.id;
  },


  /**
   * enable auto-sorting functionality
   *
   * @description it will be used to maintain the collection in sorted order
   * @help http://backbonejs.org/#Collection-comparator
   */

  comparator: 'number'


});


/**
 * exports collection
 */

module.exports = ChaptersCollection;
