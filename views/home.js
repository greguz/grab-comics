/**
 * dependencies
 */

var Marionette = require('backbone.marionette');


/**
 * super constructor
 */

var Super = Marionette.ItemView;


/**
 * HomeView
 *
 * @help http://marionettejs.com/docs/v2.4.5/marionette.itemview.html
 */

var HomeView = Super.extend({


  /**
   * pre-compiled handlebars template
   */

  template: require('../templates/home'),


  /**
   * data used to render this view
   *
   * @return {Object}
   */

  serializeData: function(){
    return { versions: process.versions };
  }


});


/**
 * exports
 */

module.exports = HomeView;
