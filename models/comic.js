/**
 * dependencies
 */

var _                   = require('lodash'),
    Promise             = require('bluebird'),
    utils               = require('../libs/utils'),
    ChaptersCollection  = require('../collections/chapters');


/**
 * super constructor for this model
 */

var Super = require('./super');


/**
 * ComicModel definition
 * @help http://backbonejs.org/#Model
 */

var ComicModel = Super.extend({


  /**
   * loki.js target collection name for plugin saving
   */

  lokiCollection: 'comics',


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

    // model type, used by GUI
    type: 'comic',

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
    this.chapters = new ChaptersCollection(null, { parent: this });

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
   * @return {Promise}
   */

  loadChapters: function() {

    // get comic's plugin
    var plugin = this.getPlugin();

    // start chapters loading
    return plugin.loadChapters(this);

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

  },


  /**
   * return target folder name for this model
   *
   * @return {String}
   */

  getFolder: function() {

    // return comic's title
    return this.get('title');

  },


  /**
   * download all comic's chapters
   *
   * @return {Promise}
   */

  download: function() {

    // this instance
    var comic = this;

    // trigger download start
    comic.set('downloadProgress', 0);

    // re-load all chapters
    return comic.loadChapters().then(function() {

      // return new promise
      return Promise.mapSeries(comic.chapters.models, function(chapter, index, length) {

        // calculate percentage progress
        var progress = _.floor(((index + 1) / length) * 100);

        // download page
        return chapter.download().finally(function() { // always

          // notify download progress
          comic.set('downloadProgress', progress);

        });

      });

    }).finally(function() { // at the end

      // trigger end download event
      comic.set('downloadProgress', 100);

    }).catch(function(err) {

      // save error
      comic.set('downloadError', err);

      // reject promise result
      return Promise.reject(err);

    });

  },


  /**
   * load comic's chapters from cache
   *
   * @description merges the model's state with attributes fetched from the server
   * @help http://backbonejs.org/#Model-fetch
   *
   * @param {Object} [options]    object passed as options to internal collection's fetch
   * @return {Promise}
   */

  fetchChapters: function(options) {

    // ensure collection options defaults
    options = _.defaults(options, {

      // do not remove any comic
      remove: false,

      // loki query
      query: {
        plugin: this.get('plugin'),
        comic: this.get('id')
      }

    });

    // return promise
    return this.chapters.fetch(options);

  }


});


/**
 * exports model
 */

module.exports = ComicModel;
