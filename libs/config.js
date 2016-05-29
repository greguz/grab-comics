/**
 * dependencies
 */

var _         = require('lodash')
  , Backbone  = require('backbone')
  , Radio     = require('backbone.radio')
  , path      = require('path')
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

    // language used by GUI
    appLanguage: 'en',

    // available app's languages
    appLanguages: [ 'en', 'it' ],

    // preferred comics languages
    preferredLanguages: [],

    // target download folder
    downloadFolder: path.join(utils.homeDir(), 'Downloads')

  }


});


/**
 * config instance and initialization
 */

// create config model instance
var config = new ConfigModel();

// get store channel
var storeChannel = Radio.channel('store');

// create config channel
var configChannel = Radio.channel('config');

// listen for store initialization
storeChannel.on('ready', function(store) {

  // get (loki) collection instance
  var collection = store.getCollection('config') || store.addCollection('config');

  // get config attributes from store
  var attributes = collection.findOne({});

  // load data to config instance
  if (attributes) config.set(attributes);

  // trigger configuration ready event
  configChannel.trigger('ready', config);

});


/**
 * exports
 */

module.exports = config;
