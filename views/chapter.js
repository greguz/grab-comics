/**
 * dependencies
 */

var _         = require('lodash')
  , Backbone  = require('backbone')
  , $         = require('jquery')
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
    require('../assets/js/turn');

    // get plugin
    this.plugin = grabbix.plugins.findWhere({ id: options.plugin });

    // get comic
    this.comic = this.plugin.comics.findWhere({ id: options.comic });

    // get chapter
    var chapter = this.comic.chapters.findWhere({ id: options.chapter });

    // load requested chapter
    this.loadChapter(chapter);

    // listen for window resizing
    $(window).on('resize', _.bind(this.refresh, this));

    // listen keyboard
    $('body').on('keyup', _.bind(this.onKeyUp, this));

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

    // unload book resources
    if (this.book) {

      // destroy turn.js instance
      this.book.turn('destroy');

      // remove object from view
      delete this.book;

    }

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

    // save new chapter
    this.chapter = chapter;

    // listen for new pages
    this.chapter.pages.on('sort', this.renderBook, this);

    // render chapter's book
    this.renderBook();

    // start pages loading
    this.chapter.loadPages(); // TODO catch errors

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

    // stop events listening
    $(window).off('resize', this.refresh);

    // stop keyboard listening
    $('body').off('keyup', this.onKeyUp);

    // return this instance
    return this;

  },


  /**
   * add page to rendered book
   *
   * @param {PageModel} page
   */

  addPage: function(page) {

    // compiled template function
    var template = require('../templates/chapter-page');

    // template data
    var data = {
      chapter: this.chapter.toJSON(),
      page: page.toJSON()
    };

    // jquery element
    var $page = $(template(data));

    // add page to book
    this.book.turn('addPage', $page, page.get('number'));

  },


  /**
   * render new book if not already defined
   */

  renderBook: function() {

    // return if already rendered
    if (this.book) return;

    // get fourth page
    var fourth = this.chapter.pages.at(3);

    // ensure we have the first four chapters
    if (!fourth || fourth.get('number') !== 4) return;

    // template data
    var data = {
      chapter: this.chapter.toJSON(),
      pages: this.chapter.pages.toJSON().slice(0, 4)
    };

    // render view's HTML
    this.$el.html(this.template(data));

    // chapter book container
    var $chapter = this.$el.find('.chapter');

    // render chapter
    this.book = $chapter.turn({

      // default dimensions
      width: 400,
      height: 300,

      // Centers the flipbook depending on how many pages are visible.
      //autoCenter: true,

      // Sets the hardware acceleration mode, for touch devices this value must be true.
      acceleration: true,

      // Specifies the directionality of the flipbook left-to-right (DIR=ltr) or right-to-left (DIR=rtl).
      direction: this.chapter.getFirst('pageDirection').toLowerCase(),

      // Sets the duration of the transition in milliseconds.
      // If you set zero, there won't be transition while turning the page.
      duration: 200,

      // add event bindings
      when: { 'turned': _.bind(this.pageLoaded, this) }

    });

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

    // reload chapter
    this.loadChapter(this.chapter);

    // return this instance
    return this;

  },


  /**
   * get jQuery <img> element by page number (start from 1)
   *
   * @param number
   * @return {*}
   */

  getImage: function(number) {

    // get page container
    var $div = this.$el.find('[page="' + number + '"]');

    // return jQuery find
    return $div.find('img');

  },


  /**
   * ensure next four images
   *
   * this function is used to avoid loading all images at once
   * by ensuring there's at least 4 images after the rendered one
   */

  ensureNextPages: function() {

    // check book instance
    if (!this.book) return;

    // get current page number
    var current = this.book.turn('page');

    // get total rendered pages
    var total = this.book.turn('pages');

    // get next target pages
    var target = current + 4;

    // if already added then return
    if (total >= target) return;

    // add all missing pages
    for (var i = ++total; i <= target; i++) {

      // get page model to add
      var model = this.chapter.pages.findWhere({ number: i });

      // add rendered page
      if (model) this.addPage(model);

    }

  },


  /**
   * callback after book's page load
   *
   * @param {*} e           DOM event object
   * @param {Number} p      actual page
   * @param {Array} pages   array of showed images at the moment
   */

  pageLoaded: function(e, p, pages) {

    // ensure next four pages
    this.ensureNextPages();

    // this instance
    var self = this;

    // save rendered images internally
    this.images = _.map(pages, function(number) {

      // get jquery element
      var $img = self.getImage(number);

      // get raw DOM element
      var img = $img.get(0);

      // ensure image element
      if (!img) return;

      // check image loading status
      if (img.naturalWidth === 0) {

        // bind image loading event
        $img.on('load', _.bind(self.refresh, self));

      }

      // return <img> element
      return img;

    });

    // refresh book dimensions
    this.refresh();

  },


  /**
   * get image's ratio
   *
   * @param {*} img       <img> DOM element
   * @return {Number}
   */

  getRatio: function(img) {

    return _.get(img, 'naturalWidth') / _.get(img, 'naturalHeight');

  },


  /**
   * refresh book dimensions
   */

  refresh: _.debounce(function() {

    // link to this instance
    var self = this;

    // get the image with smallest ration (height > width)
    var img = _.reduce(this.images, function(result, img) {

      // if result is not defined then return
      if (!result) return img;

      // check witch image has smallest ratio
      if (self.getRatio(img) < self.getRatio(result)) {
        return img;
      } else {
        return result;
      }

    });

    // real image width
    var imgWidth = _.get(img, 'naturalWidth');

    // real image height
    var imgHeight = _.get(img, 'naturalHeight');

    // jQuery header
    var $header = $('header');

    // jQuery window
    var $window = $(window);

    // max possible width for this view
    var viewWidth = this.$el.width();

    // max possible height for view
    var viewHeight = $window.height() - $header.height() - 20;

    // calculate book width
    var bookWidth = _.round((imgWidth * viewHeight) / imgHeight) * 2;

    // ensure that image will not overflow
    if (bookWidth > viewWidth) bookWidth = viewWidth;

    // refresh book dimension
    this.book.turn('size', bookWidth, viewHeight);

  }, 300),


  /**
   * keyboard keys bindings
   *
   * @param {*} e   DOM event object
   */

  onKeyUp: function(e) {

    switch (e.which) { // e.which >> keyCode

      case 37: // left arrow
        this.previousPage(); break;

      case 39: // right arrow
        this.nextPage(); break;

    }

  },


  /**
   * load and render previous chapter
   */

  previousChapter: function() {

    // comic with chapters collection
    var comic = this.comic;

    // loaded chapter
    var thisChapter = this.chapter;

    // get chapter index
    var index = comic.chapters.findIndex({ number: thisChapter.get('number') });

    // get previous chapter
    var previousChapter = this.comic.chapters.at(--index);

    // load previous chapter
    if (previousChapter) this.loadChapter(previousChapter);

  },


  /**
   * go to previous page
   * if we are at chapter beginning load previous chapter
   */

  previousPage: function() {

    // get current page number
    var currentPage = this.book.turn('page');

    // if starts of book render previous chapter
    if (currentPage === 1) {
      this.previousChapter();
    } else {
      this.book.turn('previous');
    }

  },


  /**
   * load and render next chapter
   */

  nextChapter: function() {

    // comic with chapters collection
    var comic = this.comic;

    // loaded chapter
    var thisChapter = this.chapter;

    // get chapter index
    var index = comic.chapters.findIndex({ number: thisChapter.get('number') });

    // get next chapter
    var nextChapter = this.comic.chapters.at(++index);

    // load previous chapter
    if (nextChapter) this.loadChapter(nextChapter);

  },


  /**
   * go to next page
   * if we are at chapter ending load previous chapter
   */

  nextPage: function() {

    // get current page number
    var currentPage = this.book.turn('page');

    // get total rendered pages
    var totalPages = this.book.turn('pages');

    // if ends of book load next chapter
    if (currentPage === totalPages) {
      this.nextChapter();
    } else {
      this.book.turn('next');
    }

  }


});


/**
 * exports constructor
 */

module.exports = ChapterView;
