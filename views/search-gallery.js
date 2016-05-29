/**
 * dependencies
 */

var _                   = require('lodash')
  , i18next             = require('i18next')
  , Marionette          = require('backbone.marionette')
  , PluginModel         = require('../models/plugin')
  , ComicsCollection    = require('../collections/comics')
  , SearchThumbnailView = require('../views/search-thumbnail')
  , utils               = require('../libs/utils');


/**
 * super constructor
 */

var Super = Marionette.CompositeView;


/**
 * SearchGalleryView
 *
 * @help http://marionettejs.com/docs/v2.5.6/marionette.compositeview.html
 */

var SearchGalleryView = Super.extend({


  /**
   * handlebars pre-compiled compiled template
   */

  template: require('../templates/search-gallery'),


  /**
   * customize options used to render this template
   */

  templateHelpers: function() {

    return {
      plugin: this.plugin.toJSON(),
      comics: this.plugin.comics.toJSON()
    };

  },


  /**
   * view's DOM element attributes
   */

  attributes: {
    class: 'search-gallery'
  },


  /**
   * render children views into this container
   */

  childViewContainer: '.justified-gallery',


  /**
   * view's model
   */

  model: new PluginModel(),


  /**
   * bind functions to model's events
   */

  modelEvents: {
    'change:title': 'search render',
    'change:languages': 'search render'
  },


  /**
   * children collection
   */

  collection: new ComicsCollection(),


  /**
   * plugins collection events bindings
   */

  collectionEvents: {
    'add': 'refreshGallery',
    'sort': 'refreshGallery'
  },


  /**
   * single child view constructor
   */

  childView: SearchThumbnailView,


  /**
   * function called when the view is first created
   */

  initialize: function(options) {

    // save plugin instance
    this.plugin = options.plugin;

    // require jQuery dependencies
    require('../assets/js/bootstrap');
    require('../assets/js/bootstrap-multiselect');
    require('../assets/js/jquery.justifiedGallery');

    // fetch cached comics
    this.plugin.fetchComics(); // TODO catch error

    // start plugin search
    this.search();

  },


  /**
   * triggered after the view has been rendered
   */

  onRenderTemplate: function() {

    // init languages drop-down element
    this.$el.find('select').multiselect({
      buttonClass: 'btn btn-sm btn-default',
      dropRight: true,
      onChange: _.bind(this.onLanguageChange, this),
      numberDisplayed: 1,
      nonSelectedText: i18next.t('languagesSelect.nonSelectedText'),
      nSelectedText: i18next.t('languagesSelect.nSelectedText'),
      allSelectedText: i18next.t('languagesSelect.allSelectedText')
    });

  },


  /**
   * refresh gallery component after collection render
   */

  onRenderCollection: function() {

    // alias
    this.refreshGallery();

  },


  /**
   * refresh justified-gallery component
   */

  refreshGallery: _.debounce(function() {

    // get gallery container
    var $gallery = this.$el.find('.justified-gallery');

    // justified-gallery options
    // http://miromannino.github.io/Justified-Gallery/options-and-events/
    var options = {

      // the preferred height of rows in pixel
      rowHeight: 200,

      // decide the margins between the images (pixel)
      margins: 1,

      // caption options
      captionSettings: {
        animationDuration: 250, // ms
        visibleOpacity: 1, // as CSS (0 to 1)
        nonVisibleOpacity: 0.75 // as CSS (0 to 1)
      }

    };

    // hack to avoid page jumping
    $gallery.css('min-height', $gallery.height());

    // call justified-gallery constructor
    $gallery.justifiedGallery(options);

  }, 300), // wait ms timeout


  /**
   * perform plugin comics search
   */

  search: function() {

    // gallery's loader fading animation duration
    var duration = 750;

    // this view
    var self = this;

    // start "loading" effect
    var interval = setInterval(function() {

      // toggle fade to thumbnail
      self.$el.find('.plugin-thumbnail').fadeToggle(duration); // TODO call instantly

    }, duration);

    // call plugin API
    this.plugin.searchComics(this.model.get('title'), this.model.get('languages')).finally(function() {

      // stop animation
      clearInterval(interval);

      // fade in thumbnail
      self.$el.find('.plugin-thumbnail').fadeIn(duration);

    });

  },


  /**
   * filter function to ignore comics that do not match search parameters
   *
   * @param {ComicModel} comic
   * @return {Boolean}
   */

  filter: function(comic) {

    // get searched title
    var title = this.model.get('title');

    // get requested languages
    var languages = this.model.get('languages') || [];

    // check title matching
    var titleCheck = utils.match(comic.get('title'), title);

    // check comic's language
    var langCheck = languages.indexOf(comic.get('language')) >= 0;

    // return checks
    return titleCheck && langCheck;

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

    // searched title
    var title = this.model.get('title');

    // levenshtein distances between titles
    var d1 = utils.distance(title, c1.get('title'));

    // levenshtein distances between titles
    var d2 = utils.distance(title, c2.get('title'));

    // smallest distance first
    if (d1 < d2) {
      return -1;
    } else if (d1 > d2) {
      return 1;
    } else {
      return 0;
    }

  },


  /**
   * triggered on language's options changes
   *
   * @param {*} $option           jQuery <option> element
   * @param {Boolean} selected    <option> selection status
   */

  onLanguageChange: function($option, selected) {

    // language selected
    var lang = $option.val();

    // actual languages
    var languages = this.model.get('languages') || [];

    // checked flag on <option> element
    if (selected) {

      // add language
      languages = _.union(languages, [ lang ]);

    } else {

      // remove language from array
      languages = _.difference(languages, [ lang ]);

    }

    // set new languages array
    this.model.set('languages', languages);

  }


});


/**
 * exports
 */

module.exports = SearchGalleryView;
