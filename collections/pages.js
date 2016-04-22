/**
 * dependencies
 */

var Backbone  = require('backbone')
  , PageModel = require('../models/page');


/**
 * define custom collection
 */

var Pages = Backbone.Collection.extend({


  /**
   * model constructor
   */

  model: PageModel,


  /**
   * define comparator field
   */

  comparator: 'number',


  /**
   * loki.js target collection
   */

  table: 'pages'


});


/**
 * exports constructor
 */

module.exports = Pages;