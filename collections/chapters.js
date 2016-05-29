/**
 * dependencies
 */

var Backbone = require('backbone');


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
   *
   * @param {ChapterModel} c1
   * @param {ChapterModel} c2
   * @return {Number}
   */

  comparator: function(c1, c2) {

    if (c1.get('number') < c2.get('number')) {
      return 1;
    } else if (c1.get('number') > c2.get('number')) {
      return -1;
    } else {
      return 0;
    }

  }


});


/**
 * exports collection
 */

module.exports = ChaptersCollection;
