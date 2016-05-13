/**
 * dependencies
 */

var _           = require('lodash')
  , Backbone    = require('backbone')
  , $           = require('jquery')
  , grabbix     = require('../libs/grabbix')
  , GalleryView = require('./gallery')
  , i18next     = require('i18next');


/**
 * super view constructor
 */

var Super = Backbone.View;


/**
 * SearchView definition
 *
 * @help http://backbonejs.org/#View-extend
 */

var SearchView = Super.extend({


  /**
   * handlebars compiled template function
   *
   * @help http://backbonejs.org/#View-template
   * @help http://handlebarsjs.com/
   */

  template: require('../templates/search'),


  /**
   * internal data
   */

  title: undefined, // searched title string

  galleries: [], // loaded plugin's galleries

  languages: grabbix.plugins.getLanguages(), // requested languages


  /**
   * init internal parameters and start events listening
   *
   * @description function called when the view is first created
   * @help http://backbonejs.org/#View-constructor
   *
   * @param {Object} [options]
   * @param {String} [options.title]      searched title
   * @return {SearchView}
   */

  initialize: function(options) {

    // ensure options var
    options = options || {};

    // save searched title
    if (options.title) this.title = options.title;

    // start listen to "search" event
    grabbix.dispatcher.on('header:search', this.search, this);

    // initialize base HTML
    this.$el.html(this.template({
      languages:  this.languages
    }));

    // initialize languages select
    this.$el.find('select').multiselect({
      buttonClass: 'btn btn-sm btn-default',
      dropRight: true,
      onChange: _.bind(this.languageChanged, this),
      numberDisplayed: 1,
      nonSelectedText: i18next.t('languagesSelect.nonSelectedText'),
      nSelectedText: i18next.t('languagesSelect.nSelectedText'),
      allSelectedText: i18next.t('languagesSelect.allSelectedText')
    });

    // load plugins
    this.addGallery(grabbix.plugins.at(0)); // TODO load active plugins

    // return this instance
    return this;

  },


  /**
   * create plugin's gallery
   *
   * @param {PluginModel} plugin
   * @return {GalleryView}
   */

  addGallery: function(plugin) {

    // create gallery instance
    var gallery = new GalleryView({

      // target element for gallery's render
      el: '#galleries',

      // plugin reference
      plugin: plugin

    });

    // save initialized gallery
    this.galleries.push(gallery);

    // return gallery instance
    return gallery;

  },


  /**
   * un-initialize this view and rendered galleries
   *
   * @return {SearchView}
   */

  uninitialize: function() {

    // un-initialize galleries
    _.each(this.galleries, function(gallery) {
      gallery.uninitialize();
    });

    // stop event listening for this view
    grabbix.dispatcher.off(null, null, this);

    // return this instance
    return this;

  },


  /**
   * render all galleries
   *
   * @description renders the view template from model data, and updates this.el with the new HTML
   * @help http://backbonejs.org/#View-render
   *
   * @return {SearchView}
   */

  render: function() {

    // gallery's render options
    var data = _.pick(this, 'title', 'languages');

    // each all loaded galleries
    _.each(this.galleries, function(gallery) {

      // re-render gallery
      gallery.render(data);

    });

    // return this instance
    return this;

  },


  /**
   * search comics by title
   *
   * @param {String} title    searched text
   * @return {SearchView}
   */

  search: function(title) {

    // each all loaded galleries
    _.each(this.galleries, function(gallery) {

      // call gallery's search
      gallery.render({ title: title });

    });

    // return this instance
    return this;

  },


  /**
   * callback function used to onChange event of languages select
   *
   * @param {*} option          select option HTML element
   * @param {Boolean} checked   actual option status
   * @returns {SearchView}
   */

  languageChanged: function(option, checked) {

    // language id
    var language = $(option).val();

    // each all loaded galleries
    _.each(this.galleries, function(gallery) {

      // check if language is selected or not
      if (checked) {

        // add new language
        gallery.addLanguage(language);

      } else {

        // remove language
        gallery.removeLanguage(language);

      }

    });

    // return this instance
    return this;

  }


});


/**
 * exports
 */

module.exports = SearchView;
