/**
 * dependencies
 */

var Marionette        = require('backbone.marionette'),
    PluginsCollection = require('../collections/plugins'),
    PluginsRowView    = require('../views/plugins-row');


/**
 * super view constructor
 */

var Super = Marionette.CompositeView;


/**
 * PluginsView
 *
 * @help http://marionettejs.com/docs/v2.5.6/marionette.compositeview.html
 */

var PluginsView = Super.extend({


  /**
   * pre-compiled handlebars template
   */

  template: require('../templates/plugins'),


  /**
   * children collection
   */

  collection: new PluginsCollection(),


  /**
   * single child view constructor
   */

  childView: PluginsRowView,


  /**
   * render children views into this container
   */

  childViewContainer: 'tbody'


});


/**
 * exports
 */

module.exports = PluginsView;
