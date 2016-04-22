/**
 * dependencies
 */

var _                 = require('underscore')
  , Backbone          = require('backbone')
  , ComicsCollection  = require('../collections/comics')
  , utils             = require('../libs/utils');


/**
 * plugin model definition
 */

var Plugin = Backbone.Model.extend({


  /**
   * id attribute for loki.js
   */

  idAttribute: 'id',


  /**
   * loki.js target collection
   */

  table: 'plugins',


  /**
   * collection constructor
   */

  Collection: ComicsCollection,


  /**
   * defaults attributes
   */

  defaults: {
    url         : undefined,
    languages   : [],
    name        : undefined,
    thumbnail   : undefined,
    description : undefined,
    enabled     : false
  },


  /**
   * create comics collection
   */

  initialize: function() {

    this.comics = new (this.Collection)();

  },


  /**
   * override by plugin
   * @param {Array} terms         searched entries
   * @param {Array} langs         languages requested
   * @param {Function} callback   callback function
   * @private
   */

  _loadComics: function(terms, langs, callback) {

    callback(new Error('first error')); // show error

    callback(null, { // add comic
      title: 'Example comic',
      language: 'en'
    });

    callback(); // all done

  },


  /**
   * add new comic to internal collection
   * @param {Object} data   comic data
   * @return {Comic}
   * @private
   */

  _addComic: function(data) {

    var key = {
      $plugin: this.get('$plugin'),
      $comic: utils.normalize(data.title, '_') + '-' + data.language
    };

    _.extend(data, key);

    var comic = this.comics.findWhere(key);

    if (comic) {
      return comic.set(data);
    } else {
      return this.comics.add(data);
    }

  },


  /**
   * perform comics search
   * @param {Array} terms           searched entries
   * @param {Array} langs           languages requested
   * @param {Function} [callback]   callback function
   */

  loadComics: function(terms, langs, callback) {

    var self    = this
      , end     = false
      , errors  = []
      , comics  = [];

    var stop = function() {

      if (!end) {
        end = true;
        if (callback) callback(errors, comics);
      }

    };

    var alive = _.debounce(function() {

      if (!end) {
        self.trigger('error', new Error('Plugin timeout'));
        stop();
      }

    }, 30 * 1000);

    alive();

    this._loadComics(terms, langs, function(err, data) {

      if (end) {
        return console.error(err || 'This plugin is too slow');
      } else {
        alive();
      }

      if (err) {
        errors.push(err); self.trigger('error', err);
      } else if (data) {
        comics.push(self._addComic(data));
      } else {
        stop();
      }

    });

  }


});


/**
 * export plugin constructor
 */

module.exports = Plugin;