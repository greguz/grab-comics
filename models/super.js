/**
 * dependencies
 */

var _         = require('lodash')
  , Backbone  = require('backbone')
  , utils     = require('../libs/utils')
  , config    = require('../libs/config');


/**
 * super constructor for this model
 */

var Super = Backbone.Model;


/**
 * super model definition
 */

var SuperModel = Super.extend({


  /**
   * get referenced plugin model
   *
   * @return {PluginModel}
   */

  getPlugin: function() {

    // validate internal data
    if (!this.has('plugin')) throw new Error('Plugin ID not defined');

    // return cached plugin if exists
    if (this.plugin) return this.plugin;

    // get plugin id
    var pluginID = this.get('plugin');

    // load plugins collection
    var plugins = require('../libs/plugins');

    // return plugin search
    return this.plugin = plugins.findWhere({ id: pluginID });

  },


  /**
   * get referenced comic model
   *
   * @return {ComicModel}
   */

  getComic: function() {

    // validate internal data
    if (!this.has('comic')) throw new Error('Comic ID not defined');

    // return cached comic if exists
    if (this.comic) return this.comic;

    // get comic ID
    var comicID = this.get('comic');

    // get plugin
    var plugin = this.getPlugin();

    // search comic into plugin's comics
    return this.comic = plugin.comics.findWhere({ id: comicID });

  },


  /**
   * get referenced chapter model
   *
   * @return {ChapterModel}
   */

  getChapter: function () {

    // validate internal data
    if (!this.has('chapter')) throw new Error('Chapter ID not defined');

    // return cached chapter if exists
    if (this.chapter) return this.chapter;

    // get chapter ID
    var chapterID = this.get('chapter');

    // get comic
    var comic = this.getComic();

    // search chapter into comic's chapters
    return this.chapter = comic.chapters.findWhere({ id: chapterID });

  },


  /**
   * get target download file path for this page
   *
   * @return {String}
   */

  getDownloadPath: function() {

    // target download folder
    var downloadFolder = config.get('downloadFolder');

    // first model
    var model = this;

    // result download path
    var path = [  ];

    // repeat while getParent method exists
    while (model) {

      // add folder name to array's head
      path.unshift( model.getFolder() );

      // get model's parent
      model = model.getParent ? model.getParent() : null;

    }

    // add download folder to array's head
    path.unshift(downloadFolder);

    // return sanitized path
    return utils.getPath.apply(utils, path);

  }


});


/**
 * exports page constructor
 */

module.exports = SuperModel;
