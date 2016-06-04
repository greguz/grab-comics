/**
 * dependencies
 */

var _         = require('lodash'),
    path      = require('path'),
    Promise   = require('bluebird'),
    intercom  = require('intercom'),
    utils     = require('../libs/utils');


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

    // script to fork
    var file = path.join(__dirname, '..', 'libs', 'plugin-process.js');

    // intercom options
    var options = {

      // sets the maximum number of times a given script should run
      max: 5,

      // silences the output from stdout and stderr in the parent process
      silent: true,

      // additional arguments passed to script
      options: [ 'grabbix-mangaeden' ] // TODO get module path from somewhere

    };

    // save configured intercom instance
    this.process = intercom.EventChild(file, options);

    // get collection constructor
    var ComicsCollection = require('../collections/comics');

    // create new comic collection
    this.comics = new ComicsCollection(null, { parent: this });

    // listen for errors
    this.process.on('plugin::error', function(err) {

      // TODO notify error to GUI
      console.log('error', err.stack);

    });

  },


  /**
   * prepare sub-process to execute new API
   *
   * @return {Promise}
   */

  prepareAPI: function() {

    // get child process
    var childProcess = this.process;

    // check if child process is running
    if (!childProcess.running) return Promise.resolve();

    // return new promise
    return new Promise(function(resolve) {

      // wait for process to exit
      childProcess.once('exit', function() {

        // resolve promise
        resolve();

      });

      // kill process
      childProcess.stop();

    });

  },


  /**
   * execute plugin API into a isolated sub-process
   *
   * @param {String} api    API name
   * @param {*} [arg]       optional arguments passed to API
   * @return {Promise}
   */

  execAPI: function(api, arg) {

    // get child process intercom
    var childProcess = this.process;

    // API timeout for this plugin
    var timeoutLength = this.get('timeout') || 60 * 1000;

    // get API arguments
    var apiArgs = _.values(arguments).slice(1);

    // listen for ready status
    childProcess.once('rpcready', function() {

      // launch plugin's api
      childProcess.emit.apply(childProcess, [ 'plugin::' + api ].concat(apiArgs));

    });

    // return new promise
    return new Promise(function(resolve) {

      // timeout id
      var timeout;

      // listen process death
      childProcess.once('exit', function() {

        // ensure timeout is cleared
        clearTimeout(timeout);

        // remove all listeners for this API
        childProcess.removeAllListeners('plugin::' + api + '::**');

        // resolve promise
        resolve();

      });

      // done callback on process death
      var killProcess = _.once(function() {

        // kill sub-process
        childProcess.stop();

      });

      // listen for API completion
      childProcess.once('plugin::' + api + '::done', killProcess);

      // start timeout timer
      timeout = setTimeout(killProcess, timeoutLength);

      // start sub-process
      childProcess.start();

    });

  },


  /**
   * search comics by title
   *
   * @param {String} title              searched title
   * @param {Array|String} languages    requested languages in ISO 639-1 codes
   * @return {Promise}
   */

  searchByTitle: function(title, languages) {

    // ensure languages array
    if (_.isString(languages)) languages = [ languages ];

    // this model instance
    var pluginModel = this;

    // get child process intercom
    var childProcess = this.process;

    // ensure process is dead
    return this.prepareAPI().then(function() {

      // listen for founded comics
      childProcess.on('plugin::searchByTitle::match', function(attrs) {

        // unique comic ID
        var id = [ pluginModel.get('id'), utils.normalize(attrs.title), attrs.language ];

        // extend attributes with references and unique ID
        _.extend(attrs, {
          plugin: pluginModel.get('id'),
          id: id.join('_')
        });

        // search for cached comic
        var comic = pluginModel.comics.findWhere({ id: attrs.id });

        // check search result
        if (comic) {

          // update comic attributes
          comic.set(attrs);

        } else {

          // create new comic instance and add it to collection
          pluginModel.comics.add(attrs);

        }

      });

      // execute API
      return pluginModel.execAPI('searchByTitle', title, languages);

    });

  },


  /**
   * load comic's chapters to its internal collection
   *
   * @param {ComicModel} comicModel   load chapters for this comic
   * @return {Promise}
   */

  loadChapters: function(comicModel) {

    // this model instance
    var pluginModel = this;

    // get child process intercom
    var childProcess = this.process;

    // ensure process is dead
    return this.prepareAPI().then(function() {

      // listen for founded chapters
      childProcess.on('plugin::loadChapters::match', function(chapterAttrs) {

        // extend attributes with references and unique ID
        _.extend(chapterAttrs, {
          plugin: comicModel.get('plugin'),
          comic: comicModel.get('id'),
          id: comicModel.get('id') + '_' + chapterAttrs.number
        });

        // search for cached chapter
        var chapter = comicModel.chapters.findWhere({ id: chapterAttrs.id });

        // check search result
        if (chapter) {

          // update chapter attributes
          chapter.set(chapterAttrs);

        } else {

          // create new chapter instance and add it to collection
          comicModel.chapters.add(chapterAttrs);

        }

      });

      // execute API
      return pluginModel.execAPI('loadChapters', comicModel.toJSON());

    });

  },


  /**
   * load chapter's pages to its internal collection
   *
   * @param {ChapterModel} chapterModel
   * @return {Promise}
   */

  loadPages: function(chapterModel) {

    // this model instance
    var pluginModel = this;

    // get child process intercom
    var childProcess = this.process;

    // ensure process is dead
    return this.prepareAPI().then(function() {

      // listen for loaded pages
      childProcess.on('plugin::loadPages::match', function(pageAttrs) {

        // extend attributes with references and unique ID
        _.extend(pageAttrs, {
          plugin: chapterModel.get('plugin'),
          comic: chapterModel.get('comic'),
          chapter: chapterModel.get('id'),
          id: chapterModel.get('id') + '_' + pageAttrs.number
        });

        // search for cached page
        var page = chapterModel.pages.findWhere({ id: pageAttrs.id });

        // check search result
        if (page) {

          // update page attributes
          page.set(pageAttrs);

        } else {

          // create new page instance and add it to collection
          chapterModel.pages.add(pageAttrs);

        }

      });

      // execute API
      return pluginModel.execAPI('loadPages', chapterModel.toJSON());

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
