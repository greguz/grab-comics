/**
 * dependencies
 */

var _           = require('lodash')
  , Backbone    = require('backbone')
  , $           = require('jquery')
  , chapterTpl  = require('../templates/comicChapter')
  , grabbix     = require('../libs/grabbix');


/**
 * super view constructor
 */

var Super = Backbone.View;


/**
 * ComicView definition
 *
 * @help http://backbonejs.org/#View-extend
 */

var ComicView = Super.extend({


  /**
   * handlebars compiled template function
   *
   * @help http://backbonejs.org/#View-template
   * @help http://handlebarsjs.com/
   */

  template: require('../templates/comic'),


  /**
   * init internal parameters and start events listening
   *
   * @description function called when the view is first created
   * @help http://backbonejs.org/#View-constructor
   *
   * @param {Object} [options]
   * @param {String} [options.plugin]   plugin id
   * @param {String} [options.comic]    comic id
   * @return {ComicView}
   */

  initialize: function(options) {

    // get comic's plugin
    this.plugin = grabbix.plugins.findWhere({ id: options.plugin });

    // get target comic
    this.comic = this.plugin.comics.findWhere({ id: options.comic });

    // listen for new chapters
    this.comic.chapters.on('add', this.addChapter, this);

    // re-load comic's chapters
    this.comic.loadChapters();

    // return this instance
    return this;

  },


  /**
   * un-initialize view components
   *
   * @return {ComicView}
   */

  uninitialize: function() {

    // unregister events
    this.comic.chapters.off(null, null, this);

    // return this instance
    return this;

  },


  /**
   * sort rendered chapters
   *
   * @return {ComicView}
   */

  sortChapters: _.debounce(function() { // TODO add "direction" option

    // target table
    var $table = this.$el.find('tbody');

    // get children to sort
    var $chapters = $table.children('tr');

    // call jQuery sort API
    $chapters.sort(function(c1, c2) {

      // get chapter's number
      var n1 = parseInt(c1.getAttribute('data-number'), 10);

      // get chapter's number
      var n2 = parseInt(c2.getAttribute('data-number'), 10);

      // return sort index
      if (n1 < n2) {
        return 1;
      } else if (n1 > n2) {
        return -1;
      } else {
        return 0;
      }

    });

    // reattach elements to DOM
    $chapters.detach().appendTo($table);

    // return this instance
    return this;

  }, 100),


  /**
   * add chapter to table
   *
   * @param {ChapterModel} chapter
   * @return {ComicView}
   */

  addChapter: function(chapter) {

    // chapters table
    var $table = this.$el.find('tbody');

    // chapter table row
    var $tr = $(chapterTpl({
      plugin: this.plugin.toJSON(),
      comic: this.comic.toJSON(),
      chapter: chapter.toJSON()
    }));

    // add chapter to table
    $table.append($tr);

    // sort chapters
    this.sortChapters();

    // return this instance
    return this;

  },


  /**
   * render comic view
   *
   * @description renders the view template from model data, and updates this.el with the new HTML
   * @help http://backbonejs.org/#View-render
   *
   * @return {ComicView}
   */

  render: function() {

    // template render data
    var data = {
      plugin    : this.plugin.toJSON(),
      comic     : this.comic.toJSON(),
      chapters  : this.comic.chapters.toJSON()
    };

    // render template
    this.$el.html(this.template(data));

    // listen for thumbnail's image errors
    this.$el.find('#thumbnail').on('error', _.bind(this.thumbnailError, this));

    // start affix component (bootstrap)
    this.$el.find('#comicSummary').affix({

      // pixels to offset from screen when calculating position of scroll
      offset: 125

    });

    // add all cached chapters
    this.comic.chapters.each(this.addChapter, this);

    // return this instance
    return this;

  },


  /**
   * set placeholder on thumbnail error
   *
   * @return {ComicView}
   */

  thumbnailError: function() {

    // set thumbnail placeholder
    this.$el.find('#thumbnail').attr('src', 'assets/img/placeholder.png');

    // return this instance
    return this;

  }


});


/**
 * exports
 */

module.exports = ComicView;
