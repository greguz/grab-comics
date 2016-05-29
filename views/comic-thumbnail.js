/**
 * dependencies
 */

var Marionette = require('backbone.marionette');


/**
 * super constructor
 */

var Super = Marionette.ItemView;


/**
 * ComicThumbnailView
 *
 * @help http://marionettejs.com/docs/v2.5.6/marionette.itemview.html
 */

var ComicThumbnailView = Super.extend({


  /**
   * pre-compiled handlebars template
   */

  template: require('../templates/comic-thumbnail'),


  /**
   * view element's attributes
   */

  attributes: {
    class: 'row'
  },


  /**
   * triggered after HTML render
   */

  onRender: function() {

    // get <img> element
    var $img = this.$el.find('img');

    // listen for thumbnail's image errors
    $img.on('error', function() {

      // set thumbnail placeholder
      $img.attr('src', 'assets/img/placeholder.png');

    });

  }


});


/**
 * exports
 */

module.exports = ComicThumbnailView;
