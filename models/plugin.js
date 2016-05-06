/**
 * dependencies
 */

var _                   = require('lodash')
  , Backbone            = require('backbone')
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
   * defaults
   *
   * @description used to specify the default attributes for your model
   * @help http://backbonejs.org/#Model-defaults
   */

  defaults: {

    // unique id for plugin identification
    id: 'mangaeden',

    // available languages for this plugin
    languages: [ 'en', 'it' ],

    // website url for credits
    url: 'http://www.mangaeden.com/',

    // label used by GUI, default from ID
    name: 'Manga Eden',

    // thumbnail image used into gallery
    thumbnail: 'http://cdn.mangaeden.com/images/logo2.png',

    // short description
    description: 'Manga Eden plugin for GRABBIX',

    // plugin creator credits
    credits: 'greguz',

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

    // TODO plugin initialize

  },


  /**
   * trigger callbacks for the given event, or space-delimited list of events
   * @help http://backbonejs.org/#Events-trigger
   *
   * @param {String} event
   * @param {*..} arg
   */

  trigger: function(event, arg) {

    // get all arguments
    var args = _.values(arguments);

    // call super function (without arguments modification)
    Super.trigger.apply(this, args);

    // create event ID for global dispatcher
    var globalEvent = this.get('id') + ':' + event;

    // create arguments array for global dispatcher's trigger function
    var globalArgs = [ globalEvent ].concat(args.slice(1));

    // call global dispatcher's trigger function
    utils.dispatcher.trigger.apply(utils.dispatcher, globalArgs);

  },


  /**
   * logging utility
   *
   * @param {String} level    log level: 'error', 'warn', 'success', 'info', 'verbose' or 'debug'
   * @param {*} message       toString-able message
   * @param {Object} [data]   optional JS object
   */

  log: function(level, message, data) {

    this.trigger(level, message, data);

    // TODO add other logging alias functions

  },


  /**
   * TODO write docs
   * @private
   *
   * @param {String} text       searched text
   * @param {Array} languages   requested languages array
   * @param {Function} add
   * @param {Function} end
   */

  _searchComics: function(text, languages, add, end) {

    end(new Error('searchComics function not implemented'));

  },


  /**
   * TODO write docs
   *
   * @param {String} text           searched text
   * @param {Array} languages       requested languages array
   * @param {Function} [callback]   optional callback
   */

  searchComics: function(text, languages, callback) {

    // create new result collection
    var comics = new ComicsCollection();

    // create "end" callback ensuring it will be invoked only one time
    var end = _.once(function(err) {

      // log error
      if (err) this.log('error', err);

      // call callback (what a useful comment)
      if (callback) callback(err, comics);

    });

    // create debounced end function (for timeout)
    var debounded = _.debounce(end, this.get('timeout'));

    // create "add comic" callback
    var add = function(attributes) {

      // tick timer
      debounded();

      // extend  attributes with plugin reference
      attributes.plugin = this.get('id');

      // create comic model instance
      var comic = new ComicModel(attributes);

      // save comic to result collection
      comics.add(comic);

      // emits "new comic" event
      this.trigger('comic', comic);

    };

    // bind all callbacks to this
    _.bind(add, this);
    _.bind(end, this);

    // start timer
    debounded();

    // call private function
    this._searchComics(text, languages, add, end);

  },


  /**
   * TODO write docs
   *
   * @param {ComicModel} comic    comic model
   * @param {Function} add
   * @param {Function} end
   */

  _loadChapters: function(comic, add, end) {

    end(new Error('plugin.loadChapters not implemented'));

  },


  /**
   * TODO write docs
   *
   * @param {ComicModel} comic      comic model
   * @param {Function} [callback]   optional end callback
   */

  loadChapters: function(comic, callback) {

    // create new result collection
    var chapters = new ChaptersCollection();

    // create "end" callback ensuring it will be invoked only one time
    var end = _.once(function(err) {

      // log error
      if (err) this.log('error', err);

      // call callback (what a useful comment)
      if (callback) callback(err, chapters);

    });

    // create debounced end function (for timeout)
    var debounded = _.debounce(end, this.get('timeout'));

    // create "add chapter" callback
    var add = function(attributes) {

      // tick timer
      debounded();

      // extend attributes with external reference
      _.extend(attributes, {
        plugin: comic.get('plugin'),
        comic: comic.get('id')
      });

      // create chapter model instance
      var chapter = new ChapterModel(attributes);

      // save chapter to result collection
      chapters.add(chapter);

      // emits "new chapter" event
      this.trigger('chapter', chapter);

    };

    // bind all callbacks to this
    _.bind(add, this);
    _.bind(end, this);

    // start timer
    debounded();

    // call private function
    this._loadChapters(comic, add, end);

  },


  /**
   * TODO write docs
   *
   * @param {ChapterModel} chapter    chapter model
   * @param {Function} add
   * @param {Function} end
   */

  _loadPages: function(chapter, add, end) {

    end(new Error('plugin.loadPages not implemented'));

  },


  /**
   * TODO write docs
   *
   * @param {ChapterModel} chapter    chapter model
   * @param {Function} [callback]     optional end callback
   */

  loadPages: function(chapter, callback) {

    // TODO write plugin.loadPages

  }


});


/**
 * export plugin constructor
 */

module.exports = PluginModel;
