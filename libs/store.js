/**
 * dependencies
 */

var _     = require('lodash')
  , Loki  = require('lokijs')
  , utils = require('./utils');


/**
 * store configuration
 */

// store file path
var storeFile = 'store.db';

// store instance
var store;

// store events to emits on global dispatcher
var storeEvents = [
  'pre-insert',
  'insert',
  'pre-update',
  'update',
  'delete',
  'error',
  'flushbuffer'
];

// store ready callback
var ready = function() {

  // emit ready event on global dispatcher
  utils.dispatcher.trigger('store:ready', store);

};

// store options object - http://lokijs.org/#/docs#db
var storeOptions = {

  // load a db automatically from a file or localstorage/ indexedDB
  autoload: true,

  // callback after load
  autoloadCallback: ready

};


/**
 * store initialization
 */

// create store instance
store = new Loki(storeFile, storeOptions);

// start events listening
utils.mapEvents(store, 'store', storeEvents);


/**
 * exports
 */

module.exports = store;
