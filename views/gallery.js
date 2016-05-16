/**
 * dependencies
 */

var _         = require('lodash')
  , Backbone  = require('backbone')
  , $         = require('jquery')
  , utils     = require('../libs/utils');


/**
 * super view constructor
 */

var Super = Backbone.View;


/**
 * GalleryView definition
 *
 * @help http://backbonejs.org/#View-extend
 */

var GalleryView = Super.extend({


  /**
   * justified-gallery base options
   *
   * @help http://miromannino.github.io/Justified-Gallery/options-and-events/
   */

  galleryOptions: {

    // the preferred height of rows in pixel
    rowHeight: 200,

    // decide the margins between the images (pixel)
    margins: 1,

    // caption options
    captionSettings: {
      animationDuration: 250, // ms
      visibleOpacity: 1, // as CSS (0 to 1)
      nonVisibleOpacity: 0.8 // as CSS (0 to 1)
    }

  },


  /**
   * gallery's loader fading animation duration
   */

  loaderFade: 750, // ms


  /**
   * handlebars compiled template function
   *
   * @help http://backbonejs.org/#View-template
   * @help http://handlebarsjs.com/
   */

  template: require('../templates/gallery'),


  /**
   * specify a set of DOM events that will be bound to methods
   *
   * @help http://backbonejs.org/#View-events
   */

  events: {
    'click .comic-thumbnail': 'comicSelected',
    'click .comic-favorite': 'toggleFavoriteComic'
  },


  /**
   * init internal parameters and start events listening
   *
   * @description function called when the view is first created
   * @help http://backbonejs.org/#View-constructor
   *
   * @param {Object} [options]
   * @param {PluginModel} [options.plugin]    reference plugin model
   * @param {String} [options.title]          searched title
   * @param {Array} [options.languages]       requested languages
   * @return {GalleryView}
   */

  initialize: function(options) {

    // ensure options var and set defaults
    options = _.defaults(options, {
      languages: []
    });

    // save plugin instance reference
    this.plugin = options.plugin;

    // save searched title
    this.title = options.title;

    // ensure languages uniqueness
    this.languages = _.uniq(options.languages);

    // listen for plugin's errors
    this.plugin.on('error', this.notifyError, this);

    // refresh gallery after collection's sort
    this.plugin.comics.on('sort', this.refresh, this);

    // add new comics
    this.plugin.comics.on('add', this.addComic, this);

    // gallery element selector
    var selector = '#' + this.plugin.get('id');

    // prepend gallery's template to $el
    if (this.$el.find(selector).length <= 0) {
      this.$el.prepend(this.template({ plugin: this.plugin.toJSON() }));
    }

    // set real gallery element
    this.setElement(this.$el.find(selector));

    // fetch cached comics
    this.plugin.fetchComics();

    // return this instance
    return this;

  },


  /**
   * un-initialize this view
   *
   * @return {GalleryView}
   */

  uninitialize: function() {

    // stop listen all plugin's events
    this.plugin.off(null, null, this);

    // stop listen all plugin's events
    this.plugin.comics.off(null, null, this);

    // return this instance
    return this;

  },


  /**
   * refresh jQuery gallery (debounced function to 250ms)
   *
   * @help http://miromannino.github.io/Justified-Gallery/options-and-events/
   * @help https://lodash.com/docs#debounce
   *
   * @return {GalleryView}
   */

  refresh: _.debounce(function() {

    // sort options for justified-gallery plugin
    var sort = _.bind(function(c1, c2) {

      // find first comic
      c1 = this.plugin.comics.findWhere({ id: c1.id });

      // find second comic
      c2 = this.plugin.comics.findWhere({ id: c2.id });

      // get distance between searched title and comic's title
      var d1 = utils.distance(this.title, c1.get('title'));

      // get distance between searched title and comic's title
      var d2 = utils.distance(this.title, c2.get('title'));

      // return smallest result
      if (d1 > d2) {
        return 1;
      } else if (d1 < d2) {
        return -1;
      } else {
        return 0;
      }

    }, this); // bind function to this

    // get gallery container
    var $gallery = this.$el.find('.justified-gallery');

    // get gallery options
    var options = _.clone(this.galleryOptions);

    // extend options with sorting function
    _.extend(options, { sort: sort });

    // call justified-gallery constructor
    $gallery.justifiedGallery(options);

    // return this instance
    return this;

  }, 100),


  /**
   * render comic into gallery
   *
   * @param {ComicModel} comic
   * @return {GalleryView}
   */

  addComic: function(comic) {

    // gallery container
    var $gallery = this.$el.find('.justified-gallery');

    // check if comic is already rendered
    if ($gallery.find('#' + comic.get('id')).length > 0) return this;

    // comic gallery's template
    var thumbnailTpl = require('../templates/thumbnail');

    // create gallery's entry
    var $comic = $(thumbnailTpl({
      plugin: this.plugin.toJSON(),
      comic: comic.toJSON()
    }));

    // add "image not found" listener
    $comic.find('img').error(function() {

      // set placeholder to img element
      $(this).attr('src', 'assets/img/placeholder.png');

    });

    // append element to gallery
    $gallery.append($comic);

    // refresh gallery (because sorting)
    this.refresh();

    // return this instance
    return this;

  },


  /**
   * execute plugin's comics search
   *
   * @param {String} [title]      searched title
   * @param {Array} [languages]   requested languages
   * @return {GalleryView}
   */

  search: function(title, languages) {

    // update searched title
    title = title || this.title;

    // update requested languages
    languages = languages || this.languages;

    // animation duration
    var duration = this.loaderFade;

    // gallery thumbnail element
    var $thumbnail = this.$el.find('.title');

    // start "loading" effect
    var interval = setInterval(function() {

      // toggle fade to thumbnail
      $thumbnail.fadeToggle(duration); // TODO call instantly

    }, duration);

    // call plugin API
    this.plugin.searchComics(title, languages).finally(function() {

      // stop animation
      clearInterval(interval);

      // fade in thumbnail
      $thumbnail.fadeIn(duration);

    });

    // return this instance
    return this;

  },


  /**
   * render gallery
   *
   * @description renders the view template from model data, and updates this.el with the new HTML
   * @help http://backbonejs.org/#View-render
   *
   * @param {Object} [options]
   * @param {String} [options.title]      update searched text
   * @param {Array} [options.languages]   update requested languages
   * @return {GalleryView}
   */

  render: function(options) {

    // ensure options
    options = _.defaults(options, {});

    // update searched title
    this.title = options.title || this.title;

    // update requested languages
    this.languages = options.languages || this.languages;

    // destroy gallery
    this.$el.find('.justified-gallery').html('');

    // get cached comics that match
    var comics = this.plugin.comics.match(this.title, this.languages);

    // add cached comics to gallery
    _.each(comics, this.addComic.bind(this));

    // start plugin search
    this.search();

    // return this instance
    return this;

  },


  /**
   * add language and refresh gallery
   *
   * @param {String} lang
   * @return {GalleryView}
   */

  addLanguage: function(lang) {

    // check if language is already loaded
    if (this.languages.indexOf(lang) >= 0) return this;

    // add language
    this.languages.push(lang);

    // get cached comics that match
    var comics = this.plugin.comics.match(this.title, lang);

    // add cached comics to gallery
    _.each(comics, this.addComic.bind(this));

    // launch search for new language
    //this.search(null, [ lang ]); TODO add option to lunch this

    // return this instance
    return this;

  },


  /**
   * remove language and refresh gallery
   *
   * @param {String} lang
   * @return {GalleryView}
   */

  removeLanguage: function(lang) {

    // get language's index
    var index = this.languages.indexOf(lang);

    // check if language is not loaded
    if (index === -1) return this;

    // remove language from array
    this.languages.splice(index, 1);

    // remove comics with removed language
    this.$el.find('[data-language="' + lang + '"]').remove();

    // refresh gallery
    this.refresh();

    // return this instance
    return this;

  },


  /**
   * show error notification
   *
   * @param {*} err
   * @return {GalleryView}
   */

  notifyError: function(err) {

    // log stack error to console
    console.error(err.stack || err.toString()); // TODO enable this only in DEV mode

    // notify user
    $.notify({
      icon: 'glyphicon glyphicon-warning-sign',
      message: err.toString(),
      url: null
    }, {
      type: "danger"
    });

    // return this instance
    return this;

  },


  /**
   * get comic by DOM event
   *
   * @param {*} e
   * @return {ComicModel}
   */

  getComic: function(e) {

    // get thumbnail container
    var $thumbnail = $(e.target).closest('.comic-thumbnail');

    // get comic ID
    var comicID = $thumbnail.attr('data-comic');

    // return searched comic
    return this.plugin.comics.findWhere({ id: comicID });

  },


  /**
   * navigate to ComicView
   *
   * @param {*} e   DOM event object
   */

  comicSelected: function(e) {

    // get comic instance
    var comic = this.getComic(e);

    // navigate to comic view
    location.href = '#comic/' + this.plugin.get('id') + '/' + comic.get('id');

  },


  /**
   * toggle comic's favorite flag
   *
   * @param {*} e
   */

  toggleFavoriteComic: function(e) {

    // prevent default navigation (click over <a> element)
    e.preventDefault();

    // prevent other callbacks (comicSelected function)
    e.stopPropagation();

    // get clicked comic
    var comic = this.getComic(e);

    // toggle favorite flag
    comic.set('favorite', !comic.get('favorite'));

    // save comic to DB
    comic.save(); // TODO remove comic cache if is not favorite

    // toggle .favorite class on star
    $(e.target).closest('.comic-favorite').toggleClass('favorite');

  }


});


/**
 * exports
 */

module.exports = GalleryView;
