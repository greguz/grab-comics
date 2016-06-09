/**
 * dependencies
 */

var Marionette  = require('backbone.marionette'),
    i18next     = require('i18next');


/**
 * LayoutView
 *
 * @description root regions for app management
 * @help http://marionettejs.com/docs/v2.4.5/marionette.layoutview.html
 */

// create new layout view constructor
var LayoutView = Marionette.LayoutView.extend({


  /**
   * pre-compiled handlebars template
   */

  template: require('../templates/layout'),


  /**
   * target element where render
   */

  el: 'body',


  /**
   * regions definition
   */

  regions: {
    header: 'header',
    main: '#main-content',
    footer: 'footer'
  },


  /**
   * triggered on view creation
   */

  initialize: function() {

    // listen for lang changes
    i18next.on('languageChanged', this.onLanguageChanged.bind(this));

  },


  /**
   * triggered on i18next changes
   */

  onLanguageChanged: function() {

    // re-render entire layout
    this.regionManager.each(function(region) {

      // re-render region's view
      if (region.currentView) region.currentView.render();

    });

  }


});


/**
 * exports
 */

module.exports = LayoutView;
