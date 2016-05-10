/**
 * dependencies
 */

var _           = require('lodash')
  , Backbone    = require('backbone')
  , Handlebars  = require('handlebars')
  , $           = require('jquery')
  , app         = require('../libs/app')
  , searchTpl   = require('../templates/search')
  , termTpl     = require('../templates/term')
  , GalleryView = require('./gallery');


/**
 * exports view constructor
 */

module.exports = Backbone.View.extend({

  template: searchTpl(Handlebars),

  events: {
    'click .term a': 'removeTerm'
  },

  initialize: function(options) {

    this.terms = _.uniq(options.terms);
    this.langs = _.uniq(options.langs);
    this.galleries = [];

    app.dispatcher.on('header:search', this.addTerm, this);

    this.$el.html(this.template());

    this.$el.find('select').multiselect({
      buttonClass: 'btn btn-sm btn-default',
      dropRight: true
    });

    this.initializeGallery(app.plugins.at(0));

  },

  initializeGallery: function(plugin) {

    this.galleries.push(new GalleryView({
      el: '#galleries',
      plugin: plugin
    }));

  },

  uninitialize: function() {

    _.each(this.galleries, function(gallery) {
      gallery.uninitialize();
    });

    app.dispatcher.off('header:search', this.addTerm, this);

  },

  render: function() {

    this.$el.find('.term').remove();

    _.each(this.terms, function(term) {
      this.$el.find('#terms').append(termTpl(Handlebars)({
        value: term
      }));
    }, this);

    _.each(this.galleries, function(gallery) {
      gallery.render({
        terms: this.terms,
        langs: this.langs
      });
    }, this);

  },

  addTerm: function(term) {

    this.$el.find('#terms').append(termTpl(Handlebars)({
      value: term
    }));

    _.each(this.galleries, function(gallery) {
      gallery.addTerm(term);
    }, this);

  },

  removeTerm: function(e) {

    console.log(e);

  }

});
