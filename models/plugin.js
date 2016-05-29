/**
 * dependencies
 */

var _       = require('lodash')
  , Promise = require('bluebird')
  , utils   = require('../libs/utils');


/**
 * super constructor global variable
 */

var Super = require('./super'); // base model class


/**
 * plugin model definition
 */

var PluginModel = Super.extend({


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

    // unique id for plugin identification
    // id: 'mangaeden',

    // available languages for this plugin
    // languages: [ 'en', 'it' ],

    // website url for credits
    // url: 'http://www.mangaeden.com/',

    // label used by GUI, default from ID
    // name: 'Manga Eden',

    // thumbnail image used into gallery
    // thumbnail: 'http://cdn.mangaeden.com/images/logo2.png',

    // short description
    // description: 'Manga Eden plugin for GRABBIX',

    // plugin creator credits
    // credits: 'greguz',

    // max time allowed for plugin functions to end
    timeout: 60 * 1000,

    // direction of the overall page organization: 'LTR' or 'RTL'
    pageDirection: 'LTR'

  },


  /**
   * model initialization
   *
   * @description function that will be invoked when the model is created
   * @help http://backbonejs.org/#Model-constructor
   */

  initialize: function() {

    // get collection constructor
    var ComicsCollection = require('../collections/comics');

    // create new comic collection
    this.comics = new ComicsCollection();

  },


  /**
   * start plugin-specific code to search comics
   *
   * this function will be overridden by plugin definition
   * this is just a placeholder
   *
   * @private
   *
   * @param {String} title      searched title
   * @param {Array} languages   requested languages
   * @param {Function} add      function to invoke with comic's attributes
   * @param {Function} end      function to invoke at the end of searching process
   */

  _searchComics: function(title, languages, add, end) {

    end(new Error('searchComics function not implemented'));

  },


  /**
   * start comics searching process
   *
   * @param {String} title      searched title
   * @param {Array} languages   requested languages in ISO 639-1 codes
   * @return {Promise}
   */

  searchComics: function(title, languages) {

    // this plugin instance
    var plugin = this;

    // comics collection instance
    var comics = this.comics;

    // return new promise
    return new Promise(function(resolve, reject) {

      // create "end" callback ensuring it will be invoked only one time
      var end = _.once(function(err) {

        // log error
        if (err) plugin.trigger('error', err);

        // close promise
        if (err) reject(err); else resolve(comics);

      });

      // create debounced end function (for timeout)
      var debounded = _.debounce(end, plugin.get('timeout'));

      // create "add comic" callback
      var add = function(attrs) {

        // tick timer
        debounded();

        // unique comic ID
        var id = [ plugin.get('id'), utils.normalize(attrs.title), attrs.language ];

        // extend attributes with references and unique ID
        _.extend(attrs, {
          plugin: plugin.get('id'),
          id: id.join('_')
        });

        // search for cached comic
        var comic = comics.findWhere({ id: attrs.id });

        // check search result
        if (comic) {

          // update comic attributes
          comic.set(attrs);

        } else {

          // create new comic instance and add it to collection
          comics.add(attrs);

        }

      };

      // start timer
      debounded();

      // call private function
      plugin._searchComics(title, languages, add, end);

    });

  },


  /**
   * start plugin-specific code to fetch comic's chapters
   *
   * this function will be overridden by plugin definition
   * this is just a placeholder
   *
   * @private
   *
   * @param {ComicModel} comic    comic model
   * @param {Function} add        function to invoke with chapter's attributes
   * @param {Function} end        function to invoke at the end of fetching process
   */

  _loadChapters: function(comic, add, end) {

    end(new Error('plugin.loadChapters not implemented'));

  },


  /**
   * load comic's chapters to its internal collection
   *
   * @param {ComicModel} comic    comic model
   * @return {Promise}
   */

  loadChapters: function(comic) {

    // this plugin instance
    var plugin = this;

    // get comic's chapters collection
    var chapters = comic.chapters;

    // return new promise
    return new Promise(function(resolve, reject) {

      // create "end" callback ensuring it will be invoked only one time
      var end = _.once(function(err) {

        // log error
        if (err) plugin.trigger('error', err);

        // close promise
        if (err) reject(err); else resolve();

      });

      // create debounced end function (for timeout)
      var debounded = _.debounce(end, plugin.get('timeout'));

      // create "add chapter" callback
      var add = function(attrs) {

        // tick timer
        debounded();

        // extend attributes with references and unique ID
        _.extend(attrs, {
          plugin: comic.get('plugin'),
          comic: comic.get('id'),
          id: comic.get('id') + '_' + attrs.number
        });

        // search for cached chapter
        var chapter = chapters.findWhere({ id: attrs.id });

        // check search result
        if (chapter) {

          // update chapter attributes
          chapter.set(attrs);

        } else {

          // create new chapter instance and add it to collection
          chapters.add(attrs);

        }

      };

      // start timer
      debounded();

      // call private function
      plugin._loadChapters(comic, add, end);

    });

  },


  /**
   * start plugin-specific code to fetch chapters's pages
   *
   * this function will be overridden by plugin definition
   * this is just a placeholder
   *
   * @private
   *
   * @param {ChapterModel} chapter    chapter model
   * @param {Function} add            function to invoke with page's attributes
   * @param {Function} end            function to invoke at the end of fetching process
   */

  _loadPages: function(chapter, add, end) {

    end(new Error('plugin.loadPages not implemented'));

  },


  /**
   * load chapter's pages to its internal collection
   *
   * @param {ChapterModel} chapter    chapter model
   * @return {Promise}
   */

  loadPages: function(chapter) {

    // this plugin instance
    var plugin = this;

    // get chapter's pages collection
    var pages = chapter.pages;

    // return new promise
    return new Promise(function(resolve, reject) {

      // create "end" callback ensuring it will be invoked only one time
      var end = _.once(function(err) {

        // log error
        if (err) plugin.trigger('error', err);

        // close promise
        if (err) reject(err); else resolve();

      });

      // create debounced end function (for timeout)
      var debounded = _.debounce(end, plugin.get('timeout'));

      // create "add page" callback
      var add = function(attrs) {

        // tick timer
        debounded();

        // extend attributes with references and unique ID
        _.extend(attrs, {
          plugin: chapter.get('plugin'),
          comic: chapter.get('comic'),
          chapter: chapter.get('id'),
          id: chapter.get('id') + '_' + attrs.number
        });

        // search for cached page
        var page = pages.findWhere({ id: attrs.id });

        // check search result
        if (page) {

          // update page attributes
          page.set(attrs);

        } else {

          // create new page instance and add it to collection
          pages.add(attrs);

        }

      };

      // start timer
      debounded();

      // call private function
      plugin._loadPages(chapter, add, end);

    });

  },


  /**
   * load plugin's comics from cache
   *
   * @description merges the model's state with attributes fetched from the server
   * @help http://backbonejs.org/#Model-fetch
   *
   * @param {Object} [options]    object passed as options to internal collection's fetch
   * @return {Promise}
   */

  fetchComics: function(options) {

    // ensure collection options defaults
    options = _.defaults(options, {

      // do not remove any comic
      remove: false,

      // loki query
      query: { plugin: this.get('id') }

    });

    // return promise
    return this.comics.fetch(options);

  },


  /**
   * return target folder name for this model
   *
   * @return {String}
   */

  getFolder: function() {

    // return plugin's name or id
    return this.get('name') || this.get('id');

  }


});


/**
 * export plugin constructor
 */

module.exports = PluginModel;
