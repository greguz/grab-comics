/**
 * dependencies
 */

var Marionette  = require('backbone.marionette'),
    $           = require('jquery');


/**
 * super constructor
 */

var Super = Marionette.ItemView;


/**
 * SearchThumbnailView
 *
 * @help http://marionettejs.com/docs/v2.5.6/marionette.itemview.html
 */

var SearchThumbnailView = Super.extend({


  /**
   * view's DOM element tag name
   */

  tagName: 'div',


  /**
   * a hash of attributes that will be set as HTML DOM element attributes on the view's el
   */

  attributes: {
    'class': 'comic-thumbnail'
  },


  /**
   * handlebars pre-compiled compiled template
   */

  template: require('../templates/search-thumbnail'),


  /**
   * specify a set of DOM events that will be bound to methods
   */

  events: {
    'click': 'comicSelected',
    'click .comic-favorite': 'toggleFavoriteComic'
  },


  /**
   * triggered after the view has been rendered
   */

  onRender: function() {

    // set element ID
    this.$el.attr('id', this.model.get('id'));

    // add "image error" listener
    this.$el.find('img').on('error', this.onImgError);

  },


  /**
   * set default image placeholder on error
   */

  onImgError: function(e) {

    // set image placeholder
    $(e.target).attr('src', 'assets/img/placeholder.png');

    // TODO refresh gallery

  },


  /**
   * navigate to ComicView
   */

  comicSelected: function() {

    // get comic instance
    var comic = this.model;

    // navigate to comic view
    location.href = '#comic/' + comic.get('plugin') + '/' + comic.get('id');

  },


  /**
   * toggle comic's favorite flag
   */

  toggleFavoriteComic: function(e) {

    // prevent default navigation (click over <a> element)
    e.preventDefault();

    // prevent other callbacks (comicSelected function)
    e.stopPropagation();

    // this instance
    var self = this;

    // target favorite status
    var isFavorite = !this.model.get('favorite');

    // update model
    this.model.set('favorite', isFavorite);

    // promise var
    var p;

    // check favorite status
    if (isFavorite) {

      // save comic to DB
      p = this.model.save();

    } else {

      // delete comic from backend
      p = this.model.delete();

    }

    // on success
    p.then(function() {

      // toggle .favorite class on star
      self.$el.find('.comic-favorite').toggleClass('favorite');

    });

    // TODO catch error

  }


});


/**
 * exports
 */

module.exports = SearchThumbnailView;
