/**
 * dependencies
 */

var _                   = require('lodash')
  , Backbone            = require('backbone')
  , ChaptersCollection  = require('../collections/chapters')
  , utils               = require('../libs/utils');


/**
 * super constructor for this model
 */

var Super = Backbone.Model;


/**
 * ComicModel definition
 * @help http://backbonejs.org/#Model
 */

var ComicModel = Super.extend({


  /**
   * loki.js target collection name for plugin saving
   */

  lokiCollection: 'plugins',


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
   * model initialization
   *
   * @description function that will be invoked when the model is created
   * @help http://backbonejs.org/#Model-constructor
   */

  initialize: function() {

    // create new chapters collection
    var chapters = new ChaptersCollection();

    // "new chapter" plugin's event
    var event = this.get('plugin') + ':chapter';

    // start event listening
    utils.dispatcher.on(event, function(chapter) {

      // check if chapter is from this comic
      if (this.get('id') === chapter.get('comic')) {

        // save chapter
        chapters.add(chapter);

      }

    }, this); // bind function to this

    // save chapters collection internally
    this.chapters = chapters;

  },


  /**
   * get reading status (for loaded chapters)
   *
   * @return {Boolean}
   */

  isRead: function() {

    // reduce initial value
    var initial = true;

    // reduce function
    var reduce = function(result, chapter) {
      return result && !!chapter.isRead();
    };

    // execute reduce
    return this.chapters.reduce(reduce, initial);

  },


  /**
   * start chapters loading
   *
   * @param {Function} [callback]   optional end callback
   */

  loadChapters: function(callback) {

    // plugin API event
    var event = this.get('plugin') + ':loadChapters';

    // trigger global dispatcher
    utils.dispatcher.trigger(event, this, callback);

  },


  /**
   * check if comic's title match with any of passed strings
   *
   * @help https://lodash.com/docs#reduce
   *
   * @param {String..} title
   * @return {Boolean}
   */

  matchTitle: function(title) {

    // this comic title
    var thisTitle = this.get('title');

    // initial reduce value
    var initial = false;

    // reduce function
    var reduce = function(result, arg) {
      return result || utils.match(thisTitle, arg);
    };

    // execute reduce
    return _.reduce(arguments, reduce, initial);

  },


  /**
   * check if comic's language match with any of passed strings
   *
   * @help https://lodash.com/docs#reduce
   *
   * @param {String..} language
   * @return {Boolean}
   */

  matchLanguage: function(language) {

    // this comic title
    var thisLanguage = this.get('language');

    // initial reduce value
    var initial = false;

    // reduce function
    var reduce = function(result, arg) {
      return result || utils.match(thisLanguage, arg);
    };

    // execute reduce
    return _.reduce(arguments, reduce, initial);

  },


  /**
   * double match for title and language utility
   *
   * @param {String|Array} [titles]       title string or array
   * @param {String|Array} [languages]    language id or arrays
   * @return {Boolean}
   */

  match: function(titles, languages) {

    // ensure titles array
    if (_.isString(titles)) titles = [ titles ];

    // ensure languages array
    if (_.isString(languages)) languages = [ languages ];

    // result variable
    var result = true;

    // titles match result
    if (titles) result &= this.matchTitle.apply(this, titles);

    // languages match result
    if (languages) result &= this.matchLanguage.apply(this, languages);

    // return result
    return result;

  }


});


/**
 * exports model
 */

module.exports = ComicModel;
