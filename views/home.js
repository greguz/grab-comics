/**
 * dependencies
 */

var _           = require('underscore')
  , Backbone    = require('backbone')
  , Handlebars  = require('handlebars')
  , homeTpl     = require('../templates/home');


/**
 * exports view constructor
 */

module.exports = Backbone.View.extend({

  template: homeTpl(Handlebars),

  render: function() {

    this.$el.html(this.template({ versions: process.versions }));

  }

});