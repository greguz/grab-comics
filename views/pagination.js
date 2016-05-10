/**
 * dependencies
 */

var _         = require('lodash')
  , Backbone  = require('backbone');


/**
 * exports view constructor
 */

module.exports = Backbone.View.extend({

  template: require('../templates/pagination'),

  render: function() {

    this.$el.html(this.template());

  }

});
