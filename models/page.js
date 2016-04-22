/**
 * dependencies
 */

var _         = require('underscore')
  , Backbone  = require('backbone');


/**
 * page model definition
 */

var Page = Backbone.Model.extend({


  /**
   * id attribute for loki.js
   */

  idAttribute: '$loki',


  /**
   * loki.js target collection
   */

  table: 'pages',


  /**
   * default values
   */

  defaults: {
    number  : undefined,
    url     : undefined
  },


  /**
   * validation utility function
   * @param {Object} attributes   model attributes to validate
   * @param {Object} options      input options
   * @return {Undefined|Error}
   */

  validate: function(attributes, options) {
    //if (!attributes.number)   return new Error('Chapter number is mandatory');
    //if (!attributes.pages)    return new Error('Chapter pages number is mandatory');
    //if (!attributes.language) return new Error('Chapter language is mandatory');
  }


});


/**
 * exports page constructor
 */

module.exports = Page;