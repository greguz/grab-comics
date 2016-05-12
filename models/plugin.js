/**
 * dependencies
 */

var _                   = require('lodash')
  , Backbone            = require('backbone')
  , Promise             = require('bluebird')
  , utils               = require('../libs/utils')
  , ComicsCollection    = require('../collections/comics')
  , ComicModel          = require('../models/comic')
  , ChaptersCollection  = require('../collections/chapters')
  , ChapterModel        = require('../models/chapter')
  , PagesCollection     = require('../collections/pages')
  , PageModel           = require('../models/page');


/**
 * super constructor global variable
 */

var Super = Backbone.Model; // base model class


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
    timeout: 60 * 1000

  },


  /**
   * model initialization
   *
   * @description function that will be invoked when the model is created
   * @help http://backbonejs.org/#Model-constructor
   */

  initialize: function() {

    // this plugin instance ID
    var pluginID = this.get('id');

    // create new comic collection
    var comics = new ComicsCollection();

    // "new comic" plugin's event
    var event = pluginID + ':comic';

    // start event listening
    utils.dispatcher.on(event, function(comic) {

      // save comic to comics collection
      comics.add(comic);

    }, this); // bind function to this

    // save comics collection internally
    this.comics = comics;

    // register API to global dispatcher
    utils.dispatcher.on(pluginID + ':searchComics', this.searchComics, this);
    utils.dispatcher.on(pluginID + ':loadChapters', this.loadChapters, this);
    utils.dispatcher.on(pluginID + ':loadPages', this.loadPages, this);

  },


  /**
   * add events triggering to global dispatcher
   *
   * @description trigger callbacks for the given event, or space-delimited list of events
   * @help http://backbonejs.org/#Events-trigger
   *
   * @param {String} event
   * @param {*..} arg
   */

  trigger: function(event, arg) {

    // get all arguments
    var args = _.values(arguments);

    // call super function (without arguments modification)
    Super.prototype.trigger.apply(this, args);

    // create event ID for global dispatcher
    var globalEvent = this.get('id') + ':' + event;

    // create arguments array for global dispatcher's trigger function
    var globalArgs = [ globalEvent ].concat(args.slice(1));

    // call global dispatcher's trigger function
    utils.dispatcher.trigger.apply(utils.dispatcher, globalArgs);

  },


  /**
   * logging utility (winston.js style)
   *
   * @param {String} level    log level: 'error', 'warn', 'success', 'info', 'verbose' or 'debug'
   * @param {*} message       toString-able message
   * @param {Object} [data]   optional JS object
   */

  log: function(level, message, data) {

    // ensure string message
    message = message.toString();

    // trigger event
    this.trigger(level, message, data);

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
   * @param {String} title          searched title
   * @param {Array} languages       requested languages in ISO 639-1 codes
   * @param {Function} [callback]   optional end callback
   */

  searchComics: function(title, languages, callback) {

    // this plugin instance
    var plugin = this;

    // create new result collection
    var comics = new ComicsCollection();

    // create "end" callback ensuring it will be invoked only one time
    var end = _.once(_.bind(function(err) {

      // log error
      if (err) this.log('error', err);

      // call callback (what a useful comment)
      if (callback) callback(err, comics);

    }, this)); // bind function to plugin

    // create debounced end function (for timeout)
    var debounded = _.debounce(end, this.get('timeout'));

    // create "add comic" callback
    var add = _.bind(function(attrs) {

      // tick timer
      debounded();

      // unique comic ID
      var id = [ plugin.get('id'), utils.normalize(attrs.title), attrs.language];

      // extend attributes with references and unique ID
      _.extend(attrs, {
        plugin: plugin.get('id'),
        id: id.join('_')
      });

      // create comic model instance
      var comic = new ComicModel(attrs);

      // save comic to result collection
      comics.add(comic);

      // emits "new comic" event
      this.trigger('comic', comic);

    }, this); // bind function to plugin

    // start timer
    debounded();

    // call private function
    this._searchComics(title, languages, add, end);

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
   * @param {ComicModel} comic      comic model
   * @param {Function} [callback]   optional end callback
   */

  loadChapters: function(comic, callback) {

    // create new result collection
    var chapters = new ChaptersCollection();

    // create "end" callback ensuring it will be invoked only one time
    var end = _.once(_.bind(function(err) {

      // log error
      if (err) this.log('error', err);

      // call callback (what a useful comment)
      if (callback) callback(err, chapters);

    }, this)); // bind function to plugin

    // create debounced end function (for timeout)
    var debounded = _.debounce(end, this.get('timeout'));

    // create "add chapter" callback
    var add = _.bind(function(attrs) {

      // tick timer
      debounded();

      // extend attributes with references and unique ID
      _.extend(attrs, {
        plugin: comic.get('plugin'),
        comic: comic.get('id'),
        id: comic.get('id') + '_' + attrs.number
      });

      // create chapter model instance
      var chapter = new ChapterModel(attrs);

      // save chapter to result collection
      chapters.add(chapter);

      // emits "new chapter" event
      this.trigger('chapter', chapter);

    }, this); // bind function to plugin

    // start timer
    debounded();

    // call private function
    this._loadChapters(comic, add, end);

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
   * @param {Function} [callback]     optional end callback
   */

  loadPages: function(chapter, callback) {

    // create new result collection
    var pages = new PagesCollection();

    // create "end" callback ensuring it will be invoked only one time
    var end = _.once(_.bind(function(err) {

      // log error
      if (err) this.log('error', err);

      // call callback (what a useful comment)
      if (callback) callback(err, pages);

    }, this)); // bind function to plugin

    // create debounced end function (for timeout)
    var debounded = _.debounce(end, this.get('timeout'));

    // create "add page" callback
    var add = _.bind(function(attrs) {

      // tick timer
      debounded();

      // extend attributes with references and unique ID
      _.extend(attrs, {
        plugin: chapter.get('plugin'),
        comic: chapter.get('comic'),
        chapter: chapter.get('id'),
        id: chapter.get('id') + '_' + attrs.number
      });

      // create page model instance
      var page = new PageModel(attrs);

      // save page to result collection
      pages.add(page);

      // emits "new page" event
      this.trigger('page', page);

    }, this); // bind function to plugin

    // start timer
    debounded();

    // call private function
    this._loadPages(chapter, add, end);

  },


  /**
   * load plugin data and plugin's comics from cache
   *
   * @description merges the model's state with attributes fetched from the server
   * @help http://backbonejs.org/#Model-fetch
   *
   * @param {Object} [modelOpt]         object passed as options to model's fetch
   * @param {Object} [collectionOpt]    object passed as options to internal collection's fetch
   * @return {Promise}
   */

  fetch: function(modelOpt, collectionOpt) {

    // ensure collection options defaults
    collectionOpt = _.defaults(collectionOpt, {
      query: {
        plugin: this.get('id')
      }
    });

    // return promise
    return Promise.all([

      // fetch plugin data
      Super.prototype.fetch.call(this, modelOpt),

      // fetch plugin's comics data
      this.comics.fetch(collectionOpt)

    ]);

  }


});


/**
 * export plugin constructor
 */

module.exports = PluginModel;
