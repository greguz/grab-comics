/**
 * dependencies
 */

var _         = require('lodash'),
    Backbone  = require('backbone'),
    utils     = require('../libs/utils'),
    path      = require('path'),
    config    = require('../libs/config');


/**
 * super constructor for this model
 */

var Super = Backbone.Model;


/**
 * super model definition
 */

var SuperModel = Super.extend({


  /**
   * delete mode from backend
   *
   * @param {Object} [options]
   * @param {*} [options.context]           context scope for callbacks
   * @param {Function} [options.success]    success callback
   * @param {Function} [options.error]      error callback
   * @return {Promise}
   */

  delete: function(options) {

    // ensure options
    options = options ? _.clone(options) : {};

    // this model instance
    var model = this;

    // success from  callback
    var success = options.success;

    // error from callback
    var error = options.error;

    // define custom error callback
    options.error = function(resp) {

      // call error callback from options
      if (error) error.call(options.context, model, resp, options);

      // trigger error event
      model.trigger('error', model, resp, options);

    };

    // define custom success callback
    options.success = function(resp) {

      // remove model's backend id
      model.unset(model.idAttribute);

      // trigger "delete" event
      model.trigger('delete', model, model.collection, options);

      // call success callback from options
      if (success) success.call(options.context, model, resp, options);

    };

    // execute sync and return
    return this.sync('delete', this, options);

  },


  /**
   * check if model is downloading something
   *
   * @return {Boolean}
   */

  isDownloading: function() {

    // get download progress var
    var progress = this.get('downloadProgress');

    // check progress status
    return _.isNumber(progress) && progress >= 0 && progress < 100;

  },


  /**
   * get parent model
   *
   * @return {Model|Null}
   */

  getParent: function() {

    // try to get parent element
    return _.get(this, 'collection.parent') || null;

  },


  /**
   * each all parents starting from this instance
   *
   * @param {Function} callback
   */

  eachParents: function(callback) {

    // first model
    var model = this;

    // index
    var i = 0;

    // repeat while getParent method exists
    while (model) {

      // notify model
      callback.call(model, model, i++);

      // get model's parent
      model = model.getParent ? model.getParent() : null;

    }

  },


  /**
   * get plugin instance
   */

  getPlugin: function() {

    var result;

    this.eachParents(function(model) {
      result = model;
    });

    return result; // TODO ensure result instanceOf PluginModel

  },


  /**
   * get target download file path for this page
   *
   * @param {Object} [options]
   * @param {Boolean} [options.includeDownloadFolder]
   * @param {Boolean} [options.sanitize]
   * @param {String} [options.separator]
   * @return {String}
   */

  getDownloadPath: function(options) {

    // ensure options
    options = options || {};

    // result download path
    var res = [];

    // each all parents
    this.eachParents(function(model) {

      // add folder name to array's head
      res.unshift( model.getFolder() );

    });

    // add download folder to array's head
    if (options.includeDownloadFolder) res.unshift(config.get('downloadFolder'));

    if (options.sanitize) {

      // return sanitized path
      return utils.getPath.apply(utils, res);

    } else if (options.separator) {

      // return path with new separator
      return res.join(path.sep).split(path.sep).join(options.separator);

    } else {

      // return joined path
      return res.join(path.sep);

    }

  },


  /**
   * get first valued attribute from all parents
   *
   * @param {String} attribute    attribute name
   * @return {*}
   */

  getFirst: function(attribute) {

    // result var
    var result;

    // each all parents
    this.eachParents(function(model) {

      // if result is not already defined
      if (_.isUndefined(result)) {

        // load attribute from model
        result = model.get(attribute);

      }

    });

    // return result
    return result;

  }


});


/**
 * exports page constructor
 */

module.exports = SuperModel;
