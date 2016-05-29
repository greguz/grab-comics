/**
 * dependencies
 */

var Marionette          = require('backbone.marionette')
  , ComicChapterRowView = require('../views/comic-chapterRow');


/**
 * super constructor
 */

var Super = Marionette.CompositeView;


/**
 * ComicChaptersTableView
 *
 * @help http://marionettejs.com/docs/v2.5.6/marionette.compositeview.html
 */

var ComicChaptersTableView = Super.extend({


  /**
   * pre-compiled handlebars template
   */

  template: require('../templates/comic-chaptersTable'),


  /**
   * target view DOM element name
   */

  tagName: 'table',


  /**
   * view container attributes
   */

  attributes: {
    class: 'table table-condensed table-striped'
  },


  /**
   * child view's constructor
   */

  childView: ComicChapterRowView,


  /**
   * specify a jQuery selector to put the `childView` instances into
   */

  childViewContainer: 'tbody',


  /**
   * triggered on view creation
   */

  initialize: function() {

    // fetch cached chapters
    this.model.fetchChapters(); // TODO catch error

    // load comic's chapters from WEB
    this.model.loadChapters(); // TODO catch error

  }


});


/**
 * exports
 */

module.exports = ComicChaptersTableView;
