/**
 * dependencies
 */

var _         = require('underscore')
  , Backbone  = require('backbone');


/**
 * chapter model definition
 */

var Config = Backbone.Model.extend({


  /**
   * id attribute for loki.js
   */

  idAttribute: '$loki',


  /**
   * loki.js target collection
   */

  table: 'data',


  /**
   * default values
   */

  defaults: {
    type: 'config',
    languages: []
  }


});


/**
 * export chapter constructor
 */

module.exports = Config;