/**
 * dependencies
 */

var _         = require('lodash')
  , Backbone  = require('backbone')
  , grabbix   = require('../libs/grabbix');


/**
 * super view constructor
 */

var Super = Backbone.View;


/**
 * ChapterView definition
 *
 * @help http://backbonejs.org/#View-extend
 */

var ChapterView = Super.extend({


  /**
   * handlebars compiled template function
   *
   * @help http://backbonejs.org/#View-template
   * @help http://handlebarsjs.com/
   */

  template: require('../templates/chapter'),


  /**
   * init internal parameters and start events listening
   *
   * @description function called when the view is first created
   * @help http://backbonejs.org/#View-constructor
   *
   * @param {Object} [options]
   * @param {String} [options.plugin]     plugin id
   * @param {String} [options.comic]      comic id
   * @param {String} [options.chapter]    chapter id
   * @return {ChapterView}
   */

  initialize: function(options) {

    // require jQuery dependencies
    require('../assets/js/jquery.easing.1.3');
    require('../assets/js/jquery.booklet.latest');

    // get plugin
    this.plugin = grabbix.plugins.findWhere({ id: options.plugin });

    // get comic
    this.comic = this.plugin.comics.findWhere({ id: options.comic });

    // get chapter
    var chapter = this.comic.chapters.findWhere({ id: options.chapter });

    // load requested chapter
    this.loadChapter(chapter);

    // return this instance
    return this;

  },


  /**
   * load new chapter and render
   *
   * @param {ChapterModel} chapter
   * @param {Number} [page]
   * @return {ChapterView}
   */

  loadChapter: function(chapter, page) {

    // unload previous chapter
    this.unloadChapter();

    // clean actual html
    this.$el.html('');

    // save new chapter
    this.chapter = chapter;

    // set page index
    this.pageIndex = page || 0;

    // start pages loading
    this.chapter.loadPages().then(_.bind(this.render, this)); // TODO catch errors

    // return this instance
    return this;

  },


  /**
   * unload chapter resources
   *
   * @return {ChapterView}
   */

  unloadChapter: function() {

    // stop event listening on loaded chapter
    if (this.chapter) this.chapter.pages.off(null, null, this);

    // return this instance
    return this;

  },


  /**
   * un-initialize view components
   *
   * @return {ChapterView}
   */

  uninitialize: function() {

    // un-load loaded chapter (you don't say ?!)
    this.unloadChapter();

    // return this instance
    return this;

  },


  /**
   * render chapter view
   *
   * @description renders the view template from model data, and updates this.el with the new HTML
   * @help http://backbonejs.org/#View-render
   *
   * @return {ChapterView}
   */

  render: function() {

    // template data
    var data = {
      chapter: this.chapter.toJSON(),
      pages: this.chapter.pages.toJSON()
    };

    // render view
    this.$el.html(this.template(data));

    // render book
    this.$el.find('#chapter').booklet({

      // speed of the transition between pages in milliseconds
      speed: 500,

      // direction of the overall page organization. Default is "LTR", left to right
      // can also be "RTL" for languages which read right to left
      direction: this.chapter.getFirst('pageDirection'),

      // padding added to each page wrapper .b-wrap
      pagePadding: 0,

      // the size of the border around each page .b-page
      pageBorder: 0

    });

    // return this instance
    return this;

  }






/*

,
  renderPage: function() {

    var page = this.chapter.pages.at(this.pageIndex);

    if (!page) return;

    var $img = $('<img />').attr({
      alt           : 'Page ' + page.get('number'),
      src           : page.get('url'),
      'data-number' : page.get('number'),
      width         : '100%',
      height        : 'auto'
    });

    this.$el.find('div#chapterPage').html($img);

  },

  nextImage: function() {

    this.pageIndex++;

    if (this.pageIndex >= this.chapter.pages.length) {
      this.chapter.set('read', true);
      this.nextChapter();
    } else {
      this.renderPage();
    }

  },

  nextChapter: function() {

    var index   = this.comic.chapters.findIndex(this.chapter.pick('$chapter'))
      , chapter = this.comic.chapters.at(++index);

    if (chapter) this.loadChapter(chapter);

  }
*/






});


/**
 * exports constructor
 */

module.exports = ChapterView;
