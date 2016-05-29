/**
 * dependencies
 */

var Marionette = require('backbone.marionette');


/**
 * LayoutView
 *
 * @description root regions for app management
 * @help http://marionettejs.com/docs/v2.4.5/marionette.layoutview.html
 */

// create new layout view constructor
var LayoutView = Marionette.LayoutView.extend({

  // compiled template function
  template: require('../templates/layout'),

  // target render element
  el: 'body',

  // regions name and selector
  regions: {
    header: 'header',
    main: '#main-content',
    footer: 'footer'
  }

});


/**
 * exports
 */

module.exports = LayoutView;
