/**
 * dependencies
 */

var _         = require('lodash')
  , Backbone  = require('backbone')
  , utils     = require('../libs/utils');


/**
 * exports view constructor
 */

module.exports = Backbone.View.extend({

  events: {
    'change input#searchBox': 'search'
  },

  template: require('../templates/header'),

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
