/**
 * dependencies
 */

var Marionette  = require('backbone.marionette'),
    LayoutView  = require('../views/layout');


/**
 * Application
 *
 * @help http://marionettejs.com/docs/v2.4.5/marionette.application.html
 */

// create new application constructor
var Application = Marionette.Application.extend({


  /**
   * initialize too layout under "root" field
   *
   * @return {Application}
   */

  setRootLayout: function () {

    // save instance of layout
    this.root = new LayoutView();

    // render template
    this.root.render();

    // return this instance
    return this;

  }


});


/**
 * app instance and config
 */

// create new application instance
var app = new Application();

// listen for starting event
app.on('before:start', function () {

  // initialize root layout (under app.root)
  app.setRootLayout();

});

// exports app instance
module.exports = app;
