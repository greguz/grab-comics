/**
 * dependencies
 */

var _             = require('lodash')
  , Backbone      = require('backbone')
  , Handlebars    = require('handlebars')
  , paginationTpl = require('../templates/pagination');


/**
 * exports view constructor
 */

module.exports = Backbone.View.extend({

  template: paginationTpl(Handlebars),

  render: function() {

    this.$el.html(this.template());

  }

});
