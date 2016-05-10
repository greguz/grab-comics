/**
 * dependencies
 */

var _           = require('lodash')
  , Backbone    = require('backbone')
  , Handlebars  = require('handlebars')
  , utils       = require('../libs/utils')
  , headerTpl   = require('../templates/header');


/**
 * exports view constructor
 */

module.exports = Backbone.View.extend({

  events: {
    'change input#searchBox': 'search'
  },

  template: headerTpl(Handlebars),

  initialize: function() {
    this.render();
  },

  render: function() {
    this.$el.html(this.template());
    this.$el.find('#mainToolbar').find('[data-toggle="tooltip"]').tooltip();
  },

  search: function(e) {
    var $input = $(e.target);
    utils.dispatcher.trigger('header:search', $input.val());
    $input.val('');
  }

});
