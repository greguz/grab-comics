/**
 * dependencies
 */

var _               = require('underscore')
  , Backbone        = require('backbone')
  , PagesCollection = require('../collections/pages');


/**
 * chapter model definition
 */

var Chapter = Backbone.Model.extend({


  /**
   * id attribute for loki.js
   */

  idAttribute: '$loki',


  /**
   * loki.js target collection
   */

  table: 'chapters',


  /**
   * internal collection constructor
   */

  Collection: PagesCollection,


  /**
   * default values
   */

  defaults: {
    number      : undefined, // from 1
    language    : undefined, // ISO 639-1
    title       : undefined,
    description : undefined,
    url         : undefined,
    read        : false
  },


  /**
   * validation utility function
   * @param {Object} attributes   model attributes to validate
   * @param {Object} options      input options
   * @return {Undefined|Error}
   */

  validate: function(attributes, options) {

    if (!attributes.number)   return new Error('Chapter number is mandatory');
    if (!attributes.language) return new Error('Chapter language is mandatory');

  },


  /**
   * create pages collection
   */

  initialize: function() {

    this.pages = new (this.Collection)();

  },


  /**
   * load chapter pages
   */

  _loadPages: function(self, callback) {

    callback(new Error('first error')); // show error

    callback(null, { // add page
      number: 1,
      url: 'http://www.example.com/first-chapter/1.jpg'
    });

    callback(); // all done

  },


  /**
   * add page as model internally
   * @param {Object} data   page date
   * @return {Page}
   * @private
   */

  _addPage: function(data) {

    var key = {
      $plugin: this.get('$plugin'),
      $comic: this.get('$comic'),
      $chapter: this.get('$chapter'),
      $page: data.number
    };

    _.extend(data, key);

    var page = this.pages.findWhere(key);

    if (page) {
      return page.set(data);
    } else {
      return this.pages.add(data);
    }

  },


  /**
   * load pages
   * @param {Function} [callback]   callback function
   */

  loadPages: function(callback) {

    var self    = this
      , end     = false
      , errors  = []
      , pages   = [];

    var stop = function() {

      if (!end) {
        end = true;
        if (callback) callback(errors, pages);
      }

    };

    var alive = _.debounce(function() {

      if (!end) {
        self.trigger('error', new Error('Plugin timeout'));
        stop();
      }

    }, 30 * 1000);

    alive();

    this._loadPages(this, function(err, data) {

      if (err) {
        self.trigger('error', err);
      } else if (data) {
        pages.push(self._addPage(data));
      } else {
        stop();
      }

    });

  }


});


/**
 * export chapter constructor
 */

module.exports = Chapter;