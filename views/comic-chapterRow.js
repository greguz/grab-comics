/**
 * dependencies
 */

var Marionette = require('backbone.marionette');


/**
 * super constructor
 */

var Super = Marionette.ItemView;


/**
 * ComicChapterRowView
 *
 * @help http://marionettejs.com/docs/v2.5.6/marionette.itemview.html
 */

var ComicChapterRowView = Super.extend({


  /**
   * pre-compiled handlebars template
   */

  template: require('../templates/comic-chapterRow'),


  /**
   * view DOM element tag name
   */

  tagName: 'tr',


  /**
   * specify a set of DOM events that will be bound to methods
   */

  events: {
    'click .btnChapterStatus': 'toggleRead'
  },


  /**
   * toggle chapter reading status
   *
   * @param {*} e   DOM event object
   */

  toggleRead: function(e) {

    // prevent url redirect
    e.preventDefault();

    // get icon element
    var $fa = this.$el.find('.btnChapterStatus').find('.fa');

    // new read value
    var read = !this.model.get('read');

    // toggle read flag
    this.model.save({ read: read }).then(function() {

      // change icon and color according to read status
      if (read) {
        $fa.attr('class', 'fa fa-lg fa-check text-success');
      } else {
        $fa.attr('class', 'fa fa-lg fa-times text-danger');
      }

    });

    // TODO catch error

  }


});


/**
 * exports
 */

module.exports = ComicChapterRowView;
