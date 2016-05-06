/**
 * dependencies
 */

var Backbone  = require('backbone')
  , PageModel = require('../models/page');


/**
 * super constructor for this collection
 */

var Super = Backbone.Collection;


/**
 * PagesCollection definition
 * @help http://backbonejs.org/#Collection
 */

var PagesCollection = Super.extend({


  /**
   * internal model configuration
   *
   * @description specify the model class that the collection contains
   * @help http://backbonejs.org/#Collection-model
   */

  model: PageModel,


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

module.exports = PagesCollection;
