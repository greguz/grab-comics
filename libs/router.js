/**
 * dependencies
 */

var $         = require('jquery')
  , _         = require('underscore')
  , Backbone  = require('backbone')
  , utils     = require('./utils');


/**
 * Router definition
 */

var Router = Backbone.Router.extend({

  routes: {
    ''                                : 'home',
    'favorites'                       : 'favorites',
    'queue'                           : 'queue',
    'options'                         : 'options',
    'comic/:plugin/:comic'            : 'comic',
    'chapter/:plugin/:comic/:chapter' : 'chapter'
  },

  initialize: function() {

    this.view = new Backbone.View();

    Backbone.history.start();

    utils.dispatcher.on('header:search', function(term) {
      this.navigate('search');
      this.search(term);
    }, this);

  },

  render: function(view, options) {

    var actualView  = this.view
      , NewView     = require('../views/' + view);

    if (!(actualView instanceof NewView)) {

      actualView.undelegateEvents();
      if (actualView.uninitialize) actualView.uninitialize();
      actualView.$el.html('');

      this.view = new NewView(_.extend({
        el: '#main-content'
      }, options));

      this.view.render();

    }

  },

  home: function() {
    this.render('home');
  },

  favorites: function() {
    this.render('favorites');
  },

  queue: function() {
    this.render('queue');
  },

  options: function() {
    this.render('options');
  },

  search: function(term) {
    this.render('search', {
      terms: [ term ],
      langs: [ 'en', 'it' ]
    });
  },

  comic: function(plugin, comic) {
    this.render('comic', {
      plugin: plugin,
      comic: comic
    });
  },

  chapter: function(plugin, comic, chapter) {
    this.render('chapter', {
      plugin: plugin,
      comic: comic,
      chapter: chapter
    });
  }

});


/**
 * exports router instance
 */

module.exports = new Router();