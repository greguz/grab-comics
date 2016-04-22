/**
 * dependencies
 */

var $                 = require('jquery')
  , _                 = require('underscore')
  , Backbone          = require('backbone')
  , Loki              = require('lokijs')
  , utils             = require('./utils')
  , HeaderView        = require('../views/header')
  , PluginsCollection = require('../collections/plugins')
  , ConfigModel       = require('../models/config');


/**
 * add jquery to window object for stupid dependencies
 */

window.jQuery = window.$ = $;

require('../assets/js/jquery.justifiedGallery');
require('../assets/js/bootstrap');
require('../assets/js/bootstrap-switch');
require('../assets/js/bootstrap-multiselect');
require('../assets/js/bootstrap-notify');


/**
 * init helpers
 */

require('../helpers/flag');
require('../helpers/i18n');
require('../helpers/truncate');


/**
 * create global components
 */

var header = new HeaderView({ el: 'header' });

var config = new ConfigModel();

var plugins = new PluginsCollection([
  require('../plugins/mangaeden')
]);


/**
 * store creation
 */

var onStoreReady = function() {

  var data = store.getCollection('data') || store.addCollection('data');

  config.set(data.findOne({ type: 'config' }));

};

var store = new Loki('store.db', {
  autoload: true,
  autoloadCallback: onStoreReady
});


/**
 * edit Backbone.sync
 * @param {String} method
 * @param {*} model
 * @param {Object} options
 * @param {Function} options.error
 * @param {Function} options.success
 * @param {Object} [options.query]      loki query
 * @return {Promise}
 */

Backbone.sync = function(method, model, options) {

  var isCollection  = model instanceof Backbone.Collection
    , success       = options.success
    , error         = options.error
    , table         = store.getCollection(model.table) || store.addCollection(model.table)
    , result        = null;


  var doc;

  if (model.has('$loki')) {
    doc = table.get(model.get('$loki'));
  } else {

    var query = _.pick(model.toJSON(), function(value, key) {
      return key[0] === '$';
    });

  }


  if (method === 'create') {
    result = table.insert(model.toJSON());
  } else if (method === 'patch' || method === 'update') {
    result = table.update(model.toJSON());
  } else if (method === 'delete') {
    table.remove(model.get(model.idAttribute));
  } else if (method === 'read') {
    if (isCollection) {
      result = table.find(options.query || {});
    } else {
      result = table.get(model.get(model.idAttribute));
    }
  } else {
    return error(new Error('Invalid sync method'));
  }

  store.save(function(err) {
    if (err) {
      error(err);
    } else {
      success(result);
    }
  });

};


/**
 * exports
 */

module.exports = {
  dispatcher  : utils.dispatcher,
  header      : header,
  plugins     : plugins,
  router      : require('./router'),
  store       : store,
  utils       : utils,
  config      : config
};