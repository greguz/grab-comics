/**
 * dependencies
 */

var _                   = require('underscore')
  , Backbone            = require('backbone')
  , ChaptersCollection  = require('../collections/chapters')
  , utils               = require('../libs/utils');


/**
 * comic model definition
 */

var Comic = Backbone.Model.extend({


  /**
   * id attribute for loki.js
   */

  idAttribute: '$loki',


  /**
   * loki.js target collection
   */

  table: 'comics',


  /**
   * internal collection constructor
   */

  Collection: ChaptersCollection,


  /**
   * default values
   */

  defaults: {
    title       : undefined,
    language    : undefined, // ISO 639-1
    id          : undefined,
    url         : undefined,
    thumbnail   : 'assets/img/placeholder.png',
    group       : 'n/d',
    added       : 'n/d',
    release     : 'n/d',
    author      : 'n/d',
    artist      : 'n/d',
    description : '-',
    favorite    : false
  },


  /**
   * create chapters collection internally
   */

  initialize: function() {

    this.chapters = new (this.Collection)();

  },


  /**
   * normalize comic title
   * @param {String} [title]      optional title to normalize, default from attributes
   * @param {String} [replace]    invalid chars replacement
   * @return {String}
   */

  getNormalizedTitle: function(title, replace) {

    return utils.normalize(title || this.get('title'), replace);

  },


  /**
   * search into cached comics
   * @param {String} str    searched string
   * @returns {Boolean}
   */

  match: function(str) {

    return utils.match(this.get('title'), str);

  },


  /**
   * check reading status (for loaded comics)
   * @return {Boolean}
   */

  isRead: function() {

    return _.reduce(this.comics.models, function(res, comic) {
      return res && !!comic.get('read');
    }, true);

  },


  /**
   * override by plugin
   * @param {Comic} self          this instance
   * @param {Function} callback   callback function
   * @private
   */

  _loadChapters: function(self, callback) {

    callback(new Error('first error')); // show error

    callback(null, { // add chapter
      number: 1,
      title: 'The beginning'
    });

    callback(); // all done

  },


  /**
   * add chapter as model
   * @param {Object} data   chapter data
   * @return {Chapter}
   * @private
   */

  _addChapter: function(data) {

    var key = {
      $plugin: this.get('$plugin'),
      $comic: this.get('$comic'),
      $chapter: data.number
    };

    _.extend(data, key);

    var chapter = this.chapters.findWhere(key);

    if (chapter) {
      return chapter.set(data);
    } else {
      return this.chapters.add(data);
    }

  },


  /**
   * load comic chapters
   * @param {Function} [callback]   callback function
   */

  loadChapters: function(callback) {

    var self      = this
      , end       = false
      , errors    = []
      , chapters  = [];

    var stop = function() {

      if (!end) {
        end = true;
        if (callback) callback(errors, chapters);
      }

    };

    var alive = _.debounce(function() {

      if (!end) {
        self.trigger('error', new Error('Plugin timeout'));
        stop();
      }

    }, 30 * 1000);

    alive();

    this._loadChapters(this, function(err, data) {

      if (end) {
        return console.error(err || 'This plugin is too slow');
      } else {
        alive();
      }

      if (err) {
        errors.push(err); self.trigger('error', err);
      } else if (data) {
        chapters.push(self._addChapter(data));
      } else {
        stop();
      }

    });
  }


});


/**
 * export model constructor
 */

module.exports = Comic;