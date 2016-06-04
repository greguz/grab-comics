/**
 * dependencies
 */

var Marionette = require('backbone.marionette');


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
    'comic/:plugin/:comic': 'showComic',
    'chapter/:plugin/:comic/:chapter': 'showChapter'
  }

});


/**
 * exports
 */

module.exports = Router;
