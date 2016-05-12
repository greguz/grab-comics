/**
 * dependencies
 */

var _           = require('lodash')
  , Backbone    = require('backbone')
  , grabbix     = require('../libs/grabbix')
  , termTpl     = require('../templates/term')
  , GalleryView = require('./gallery');


/**
 * exports view constructor
 */

module.exports = Backbone.View.extend({

  template: require('../templates/search'),

  events: {
    'click .term a': 'removeTerm'
  },

  initialize: function(options) {

    this.terms = _.uniq(options.terms);
    this.langs = _.uniq(options.langs);
    this.galleries = [];

    grabbix.dispatcher.on('header:search', this.addTerm, this);

    this.$el.html(this.template());

    this.$el.find('select').multiselect({
      buttonClass: 'btn btn-sm btn-default',
      dropRight: true
    });

    this.initializeGallery(grabbix.plugins.at(0));

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

    grabbix.dispatcher.off('header:search', this.addTerm, this);

  },

  render: function() {

    var $el   = this.$el
      , self  = this;

    $el.find('.term').remove();

    _.each(this.terms, function(term) {
      $el.find('#terms').append(termTpl({
        value: term
      }));
    });

    _.each(this.galleries, function(gallery) {
      gallery.render({
        terms: self.terms,
        langs: self.langs
      });
    });

  },

  addTerm: function(term) {

    this.$el.find('#terms').append(termTpl({
      value: term
    }));

    _.each(this.galleries, function(gallery) {
      gallery.addTerm(term);
    });

  },

  removeTerm: function(e) {

    console.log(e);

  }

});
