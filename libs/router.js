/**
 * dependencies
 */

var $           = require('jquery')
  , _           = require('lodash')
  , Backbone    = require('backbone')
  , Marionette  = require('backbone.marionette')
  , utils       = require('./utils');


/**
 * Router
 *
 * @help http://marionettejs.com/docs/v2.4.5/marionette.approuter.html
 */

var Router = Marionette.AppRouter.extend({

  appRoutes: {
    '': 'showHome',
    'home': 'showHome',
    'plugins': 'showPlugins',
    'comic/:plugin/:comic': 'showComic'
  }

});


/**
 * exports
 */

module.exports = Router;
