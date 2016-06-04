/**
 * dependencies
 */

var Marionette = require('backbone.marionette');


/**
 * super constructor
 */

var Super = Marionette.ItemView;


/**
 * ChapterScrollPageView
 *
 * @help http://marionettejs.com/docs/v2.4.7/marionette.itemview.html
 */

var ChapterScrollPageView = Super.extend({


  /**
   * handlebars pre-compiled compiled template
   */

  template: require('../templates/chapter-scrollPage')


});


/**
 * exports
 */

module.exports = ChapterScrollPageView;
