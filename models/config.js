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
 * chapter model definition
 */

var ConfigModel = Super.extend({


  /**
   * set ID field name
   *
   * @description model's unique identifier
   * @help http://backbonejs.org/#Model-idAttribute
   */

  idAttribute: '$loki',


  /**
   * defaults
   *
   * @description used to specify the default attributes for your model
   * @help http://backbonejs.org/#Model-defaults
   */

  defaults: {
    type: 'config',
    languages: []
  }


});


/**
 * export model
 */

module.exports = ConfigModel;
