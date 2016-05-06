/**
 * dependencies
 */

var _         = require('lodash')
  , Backbone  = require('backbone');


/**
 * super constructor for this model
 */

var Super = Backbone.Model;


/**
 * page model definition
 */

var PageModel = Super.extend({


  /**
   * set ID field name
   *
   * @description model's unique identifier
   * @help http://backbonejs.org/#Model-idAttribute
   */

  idAttribute: 'id',


  /**
   * defaults
   *
   * @description used to specify the default attributes for your model
   * @help http://backbonejs.org/#Model-defaults
   */

  defaults: {
    number  : undefined,
    url     : undefined
  }


});


/**
 * exports page constructor
 */

module.exports = PageModel;
