/**
 * dependencies
 */

var Backbone    = require('backbone')
  , utils       = require('../libs/utils')
  , ComicModel  = require('../models/comic');


/**
 * super constructor for this collection
 */

var Super = Backbone.Collection;


/**
 * ComicsCollection definition
 * @help http://backbonejs.org/#Collection
 */

var ComicsCollection = Super.extend({


  /**
   * internal model configuration
   *
   * @description specify the model class that the collection contains
   * @help http://backbonejs.org/#Collection-model
   */

  model: ComicModel,


  /**
   * enable auto-sorting functionality
   *
   * @description it will be used to maintain the collection in sorted order
   * @help http://backbonejs.org/#Collection-comparator
   */

  comparator: function(comic) {

    // TODO fix this

    return utils.normalize(comic.get('title'), '_') + '-' + comic.get('language');

  }


});


/**
 * exports collection
 */

module.exports = ComicsCollection;
