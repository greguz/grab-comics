/**
 * dependencies
 */

var Backbone    = require('backbone')
  , utils       = require('../libs/utils')
  , ComicModel  = require('../models/comic');


/**
 * comics collection definition
 */

var Comics = Backbone.Collection.extend({


  /**
   * model constructor
   */

  model: ComicModel,


  /**
   * define comparator function for automatic sorting
   * @param {Comic} comic
   * @return {String}
   */

  comparator: function(comic) {
    return utils.normalize(comic.get('title'), '_') + '-' + comic.get('language');
  },


  /**
   * loki.js target collection
   */

  table: 'comics'


});


/**
 * export constructor
 */

module.exports = Comics;