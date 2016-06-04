/**
 * dependencies
 */

var Backbone          = require('backbone')
  , Marionette        = require('backbone.marionette')
  , SearchGalleryView = require('../views/search-gallery');


/**
 * super constructor
 */

var Super = Marionette.CompositeView;


/**
 * SearchView
 *
 * @help http://marionettejs.com/docs/v2.5.6/marionette.compositeview.html
 */

var SearchView = Super.extend({


  /**
   * handlebars pre-compiled compiled template
   */

  template: require('../templates/search'),


  /**
   * render children views into this container
   */

  childViewContainer: '#galleries',


  /**
   * view's model
   */

  model: new Backbone.Model(),


  /**
   * children collection
   */

  collection: new Backbone.Collection(),


  /**
   * single child view constructor
   */

  childView: SearchGalleryView,


  /**
   * options used to instance a child view
   */

  childViewOptions: function(plugin) {

    return {
      model: this.model,
      plugin: plugin,
      collection: plugin.comics
    };

  },


  /**
   * function called when the view is first created
   *
   * @param {Object} options
   * @param {String} [options.title]              searched title
   * @param {PluginsCollection} options.plugins   loaded plugins
   */

  initialize: function(options) {

    // load enabled plugins
    this.collection.set(options.plugins.filter({ enabled: true }));

    // get all available languages from enabled plugins
    this.model.set('languages', options.plugins.getLanguages({ enabled: true }));

    // init searched text
    if (options.title) this.model.set('title', options.title);

  }


});


/**
 * exports
 */

module.exports = SearchView;
