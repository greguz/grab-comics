/**
 * dependencies
 */

var _         = require('lodash')
  , Backbone  = require('backbone')
  , utils     = require('./utils');


/**
 * model's super constructor
 */

var Super = Backbone.Model;


/**
 * config model definition
 * @help http://backbonejs.org/#Model-extend
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
    languages: []
  }


});


/**
 * config instance and initialization
 */

// create config model instance
var config = new ConfigModel();

// listen for store initialization
utils.dispatcher.on('store:ready', function(store) {

  // get (loki) collection instance
  var collection = store.getCollection('config') || store.addCollection('config');

  // get config attributes from store
  var attributes = collection.findOne() || {};

  // load data to config instance
  config.set(attributes);

  // trigger configuration ready event
  utils.dispatcher.trigger('config:ready', config);

});


/**
 * exports
 */

module.exports = config;
