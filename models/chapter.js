/**
 * dependencies
 */

var _               = require('lodash'),
    Promise         = require('bluebird'),
    PagesCollection = require('../collections/pages');


/**
 * super constructor for this model
 */

var Super = require('./super');


/**
 * chapter model definition
 */

var ChapterModel = Super.extend({


  /**
   * loki.js target collection name for plugin saving
   */

  lokiCollection: 'chapters',


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
    type: 'chapter',

    number      : undefined, // from 1
    language    : undefined, // ISO 639-1
    title       : undefined,
    description : undefined,
    url         : undefined,
    read        : false
  },


  /**
   * model initialization
   *
   * @description function that will be invoked when the model is created
   * @help http://backbonejs.org/#Model-constructor
   */

  initialize: function() {

    // create new pages collection
    this.pages = new PagesCollection(null, { parent: this });

  },


  /**
   * get reading status
   *
   * @return {Boolean}
   */

  isRead: function() {

    return !!this.get('read');

  },


  /**
   * start pages loading
   *
   * @return {Promise}
   */

  loadPages: function() {

    // get chapter's plugin
    var plugin = this.getPlugin();

    // start pages loading
    return plugin.loadPages(this);

  },


  /**
   * return target folder name for this model
   *
   * @return {String}
   */

  getFolder: function() {

    // get chapter's number
    var folder = this.get('number').toString();

    // add title to folder name if it exists
    if (this.has('title')) folder += ': ' + this.get('title');

    // return folder
    return folder;

  },


  /**
   * download all chapter's pages
   *
   * @return {Promise}
   */

  download: function() {

    // this instance
    var chapter = this;

    // trigger download start
    chapter.set('downloadProgress', 0);

    // re-load all chapter's pages
    return chapter.loadPages().then(function() {

      // return new promise
      return Promise.mapSeries(chapter.pages.models, function(page, index, length) {

        // calculate percentage progress
        var progress = _.floor(((index + 1) / length) * 100);

        // download page
        return page.download().finally(function() {

          // notify download progress
          chapter.set('downloadProgress', progress);

        });

      });

    }).finally(function() { // at the end

      // trigger end download event
      chapter.set('downloadProgress', 100);

    }).catch(function(err) {

      // save error
      chapter.set('downloadError', err);

      // reject promise result
      return Promise.reject(err);

    });

  }


});


/**
 * exports model
 */

module.exports = ChapterModel;
