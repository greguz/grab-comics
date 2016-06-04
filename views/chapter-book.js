/**
 * dependencies
 */

var _           = require('lodash'),
    Marionette  = require('backbone.marionette'),
    $           = require('jquery');


/**
 * super view constructor
 */

var Super = Marionette.ItemView;


/**
 * ChapterBookView definition
 *
 * @help http://marionettejs.com/docs/v2.4.7/marionette.itemview.html
 */

var ChapterBookView = Super.extend({


  /**
   * handlebars pre-compiled template
   */

  template: require('../templates/chapter-book'),


  /**
   * event bindings for view's collection
   */

  collectionEvents: {
    'add': 'addPage'
  },


  /**
   * init internal parameters and start events listening
   */

  initialize: function() {

    // require jQuery dependencies
    require('../assets/js/jquery.easing.1.3.js');
    require('../assets/js/jquery.booklet.latest.js');

    // load chapter's page
    this.model.loadPages();

    // listen for window resizing
    $(window).on('resize', _.bind(this.onWindowResize, this));

    // listen keyboard
    $('body').on('keyup', _.bind(this.onKeyUp, this));

  },


  /**
   * triggered on view destruction but before DOM destruction
   */

  onBeforeDestroy: function() {

    // destroy booklet instance
    if (this.book) this.book.booklet('destroy');

    // stop events listening
    $(window).off('resize', _.bind(this.onWindowResize, this));

    // stop keyboard listening
    $('body').off('keyup', _.bind(this.onKeyUp, this));

  },


  /**
   * the results of the data serialization will be passed to the template
   *
   * @return {Object}
   */

  serializeData: function() {

    // get base model data
    var data = this.model.toJSON();

    // add collection data
    data.items = this.collection.toJSON();

    // return data object
    return data;

  },


  /**
   * render chapter's book
   */

  onRender: function() {

    // do not render book if there's no pages
    if (this.collection.length <= 0) return;

    // create book component
    this.book = this.$el.find('#book').booklet({

      // default dimensions
      width: 400,
      height: 300,

      // direction of the overall page organization
      direction: this.model.getFirst('pageDirection'),

      // speed of the transition between pages in milliseconds
      speed: 500,

      // padding added to each page wrapper
      pagePadding: 0,

      // display page numbers on each page
      pageNumbers: false,

      // disable keyboard bindings
      keyboard: false,

      // this event triggers after pages have finished turning
      change: _.bind(this.onPageChange, this)

    });

  },


  /**
   * add page to rendered book
   *
   * @param {PageModel} page
   */

  addPage: function(page) {

    // create new book if not defined
    if (!this.book) return this.render();

    // get template function
    var template = require('../templates/chapter-bookPage');

    // create DOM element
    var $page = $(template(page.toJSON()));

    // get page index
    var index = this.collection.findIndex(page.pick('id'));

    // add page to book
    this.book.booklet('add', index, $page);

    // refresh book size
    this.refreshBookSize();

  },


  /**
   * callback after book's page load
   *
   * @param {*} e                   jQuery event object
   * @param {Object} data
   * @param {Object} data.options   booklet options
   * @param {Number} data.index     zero-based index of the currently visible page spread
   * @param {Array} [data.pages]    an array of elements, the two currently visible pages
   * @param {*} [data.page]         element, the page that was either just added or just removed
   */

  onPageChange: function(e, data) {

    // this instance
    var self = this;

    // save rendered images internally
    this.images = _.map(data.pages, function(el) {

      // get jquery element
      var $img = $(el).find('img');

      // get raw DOM element
      var img = $img.get(0);

      // ensure image element
      if (!img) return;

      // check image loading status
      if (img.naturalWidth === 0) {

        // bind image loading event
        $img.one('load', _.bind(self.refreshBookSize, self));

      }

      // return raw <img> element
      return img;

    });

    // refresh book dimensions
    this.refreshBookSize();

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

  refreshBookSize: _.debounce(function() {

    // ensure book instance
    if (!this.book) return;

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
    var viewHeight = $window.height() - $header.height() - 75;

    // calculate book width
    var bookWidth = _.round((imgWidth * viewHeight) / imgHeight) * 2;

    // ensure that image will not overflow
    if (bookWidth > viewWidth) bookWidth = viewWidth;

    // refresh book dimension
    this.book.booklet('option', {
      width: bookWidth,
      height: viewHeight
    });

  }, 250),


  /**
   * triggered on window resize
   */

  onWindowResize: function() {

    // refresh book size
    this.refreshBookSize();

  },


  /**
   * keyboard keys bindings
   *
   * @param {*} e   DOM event object
   */

  onKeyUp: function(e) {

    // ensure booklet instance
    if (!this.book) return;

    switch (e.which) { // e.which >> keyCode

      case 37: // left arrow
        this.book.booklet('prev'); break;

      case 39: // right arrow
        this.book.booklet('next'); break;

    }

  }


});


/**
 * exports constructor
 */

module.exports = ChapterBookView;
