/**
 * dependencies
 */

var Marionette              = require('backbone.marionette')
  , ComicThumbnailView      = require('../views/comic-thumbnail')
  , ComicChaptersTableView  = require('../views/comic-chaptersTable');


/**
 * super constructor
 */

var Super = Marionette.LayoutView;


/**
 * ComicView
 *
 * @help http://marionettejs.com/docs/v2.5.6/marionette.layoutview.html
 */

var ComicView = Super.extend({


  /**
   * pre-compiled handlebars template
   */

  template: require('../templates/comic'),


  /**
   * view element tag name
   */

  tagName: 'div',


  /**
   * view element attributes
   */

  attributes: {
    class: 'row'
  },


  /**
   * regions selectors
   */

  regions: {
    thumbnail: "#comicThumbnail",
    chaptersTable: "#chaptersTable"
  },


  /**
   * triggered on view construction
   *
   * @param {Object} options
   * @param {PluginModel} options.plugin
   * @param {ComicModel} options.comic
   */

  initialize: function(options) {

    // save plugin model
    this.plugin = options.plugin;

    // save comic model
    this.comic = options.comic;

    // require jQuery dependencies
    require('../assets/js/bootstrap');

  },


  /**
   * triggered on region element attachment to DOM
   */

  onAttach: function() {

    // start affix component (bootstrap)
    this.thumbnail.$el.affix({

      // pixels to offset from screen when calculating position of scroll
      offset: 35

    });

  },


  /**
   * triggered after first render
   */

  onBeforeShow: function() {

    // show thumbnail view
    this.showChildView('thumbnail', new ComicThumbnailView({
      model: this.comic
    }));

    // show chapters table
    this.showChildView('chaptersTable', new ComicChaptersTableView({
      model: this.comic,
      collection: this.comic.chapters
    }));

  }


});


/**
 * exports
 */

module.exports = ComicView;
