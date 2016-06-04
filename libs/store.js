/**
 * dependencies
 */

var Loki  = require('lokijs'),
    Radio = require('backbone.radio'),
    utils = require('./utils');


/**
 * store configuration
 */

// store file path
var storeFile = 'store.db'; // TODO save under user's home folder

// store instance
var store;

// create store channel
var storeChannel = Radio.channel('store');

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
  storeChannel.trigger('ready', store);

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
