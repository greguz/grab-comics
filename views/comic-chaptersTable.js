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
   * avoid re-render collection view, sort DOM elements instead
   */

  reorderOnSort: true,


  /**
   * triggered on view creation
   */

  initialize: function() {

    // fetch cached chapters
    this.model.fetchChapters(); // TODO catch error

    // load comic's chapters from WEB
    this.model.loadChapters(); // TODO catch error

  },


  /**
   * custom sorting function used to sort child's views
   * override collection comparator (if exists)
   *
   * @param {ComicModel} c1
   * @param {ComicModel} c2
   * @return {Number}
   */

  viewComparator: function(c1, c2) {

    if (c1.get('number') < c2.get('number')) {
      return 1;
    } else if (c1.get('number') > c2.get('number')) {
      return -1;
    } else {
      return 0;
    }

  }


});


/**
 * exports
 */

module.exports = ComicChaptersTableView;
