/**
 * dependencies
 */

var Backbone      = require('backbone')
  , ChapterModel  = require('../models/chapter');


/**
 * define custom collection
 */

var Chapters = Backbone.Collection.extend({


  /**
   * model constructor
   */

  model: ChapterModel,


  /**
   * define comparator field
   */

  comparator: 'number',


  /**
   * loki.js target collection
   */

  table: 'chapters'


});


/**
 * exports constructor
 */

module.exports = Chapters;