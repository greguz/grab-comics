/**
 * dependencies
 */

var _           = require('underscore')
  , Backbone    = require('backbone')
  , Handlebars  = require('handlebars')
  , optionsTpl  = require('../templates/options')
  , app         = require('../libs/app');


/**
 * exports view constructor
 */

module.exports = Backbone.View.extend({

  template: optionsTpl(Handlebars),

  render: function() {

    this.$el.html(this.template({
      languages: app.plugins.getLanguages(),
      plugins: app.plugins.toJSON()
    }));

    this.$el.find('input[type="checkbox"]').bootstrapSwitch({
      size: 'mini',
      inverse: true,
      onText: '<i class="fa fa-check" />',
      onColor: 'success',
      offText: '<i class="fa fa-times" />',
      offColor: 'warning',
      onSwitchChange: this.togglePlugin.bind(this)
    });

  },

  togglePlugin: function(e, state) {

    var id      = $(e.target).closest('tr').attr('data-plugin')
      , plugin  = app.plugins.findWhere({ id: id });

    plugin.save({ enabled: state });

  }

});