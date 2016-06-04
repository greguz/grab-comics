/**
 * dependencies
 */

var _         = require('lodash'),
    Backbone  = require('backbone'),
    Radio     = require('backbone.radio'),
    path      = require('path'),
    osLocale  = require('os-locale'),
    utils     = require('./utils');


/**
 * default language and global vars
 */

// available languages for GUI
var LANGUAGES = [ 'en', 'it' ];

// default used language
var DEFAULT_LANG = _.head(LANGUAGES);

// get language used by OS
var DISCOVERED_LANG = osLocale.sync({ spawn: false });

// validate discovered language
if (_.isString(DISCOVERED_LANG)) {

  // get language id
  DISCOVERED_LANG = DISCOVERED_LANG.substr(0, 2).toLowerCase();

  // ensure that lang is available
  if (LANGUAGES.indexOf(DISCOVERED_LANG) >= 0) {

    // set discovered lang as default
    DEFAULT_LANG = DISCOVERED_LANG;

  }

}


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

    // available app's languages
    appLanguages: LANGUAGES,

    // language used by GUI
    appLanguage: DEFAULT_LANG,

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
