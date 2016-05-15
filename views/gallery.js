/**
 * dependencies
 */

var _         = require('lodash')
  , Backbone  = require('backbone')
  , $         = require('jquery');


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
      visibleOpacity: 0.9, // as CSS (0 to 1)
      nonVisibleOpacity: 0.0 // as CSS (0 to 1)
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

    // gallery element selector
    var selector = '#' + this.plugin.get('id');

    // prepend gallery's template to $el
    if (this.$el.find(selector).length <= 0) {
      this.$el.prepend(this.template({ plugin: this.plugin.toJSON() }));
    }

    // set real gallery element
    this.setElement(this.$el.find(selector));

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
    this.plugin.off('error', null, this);

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

      // first comic's index
      var i1 = this.plugin.comics.findIndex({ id: c1.id });

      // second comic's index
      var i2 = this.plugin.comics.findIndex({ id: c2.id });

      // because comics into collection are already ordered
      // we can return directly the index
      if (i1 > i2) {
        return 1;
      } else if (i1 > i2) {
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

  }, 250),


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

    // this view
    var gallery = this;

    // loaded plugin
    var plugin  = this.plugin;

    // plugin's comics
    var comics  = plugin.comics;

    // refresh gallery after collection's sort
    comics.on('sort', gallery.refresh, gallery);

    // add new comics
    comics.on('add', gallery.addComic, gallery);

    // call plugin API
    plugin.searchComics(title, languages).finally(function() {

      // stop comics collection's events listening
      comics.off(null, null, gallery);

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

  }


});


/**
 * exports
 */

module.exports = GalleryView;
