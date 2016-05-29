/**
 * dependencies
 */

var _         = require('lodash')
  , Backbone  = require('backbone')
  , Promise   = require('bluebird');


/**
 * sync method to interface Loki.js database directly
 *
 * @description Backbone.sync is the function that Backbone calls every time it attempts to read or save a model to the server
 * @help http://backbonejs.org/#Sync
 *
 * @param {String} method                 the CRUD method ("create", "read", "update", or "delete")
 * @param {*} model                       the model to be saved (or collection to be read)
 * @param {Object} [options]
 * @param {Function} [options.error]      error callback
 * @param {Function} [options.success]    success callback
 * @param {Object} [options.query]        execute JkiJS query directly
 * @return {Promise}
 */

var sync = function(method, model, options) {

  // get store connection
  var store = require('./store');

  // ensure options object
  options = _.defaults(options, {});

  // get target collection name
  var collectionName = model.lokiCollection;

  // get (loki) collection instance
  var collection = store.getCollection(collectionName) || store.addCollection(collectionName);

  // loki command result var
  var result;

  // CRUD methods
  if (method === 'create') {

    // create new object into collection
    result = collection.insert(model.toJSON());

  } else if (method === 'patch' || method === 'update') {

    // update object to collection
    result = collection.update(model.toJSON());

  } else if (method === 'delete') {

    // remove object
    collection.remove(model.toJSON());

  } else if (method === 'read') {

    // on READ we have to change query id "model" var is a collection
    if (model instanceof Backbone.Collection) {

      // execute find query
      result = collection.where(_.matches(options.query));

    } else {

      // find particular object
      result = collection.get(model.get('$loki'));

    }

  }

  // return new promise instance
  return new Promise(function(resolve, reject) {

    // error callback
    var error = function(err) {

      // exec options.error callback
      if (options.error) options.error(err);

      // reject promise with error
      reject(err);

    };

    // success callback
    var success = function(data) {

      // exec options.success callback
      if (options.success) options.success(data);

      // resolve promise
      resolve(data);

    };

    // if we are only reading then return
    if (method === 'read') return success(result);

    // ensure store updating
    store.save(function(err) {

      if (err) {
        error(err);
      } else {
        success(result);
      }

    });

  });

};


/**
 * global settings and exports
 */

// save old Backbone.sync
Backbone.syncOld = Backbone.sync;

// set new sync method
Backbone.sync = sync;

// exports sync method
module.exports = sync;
