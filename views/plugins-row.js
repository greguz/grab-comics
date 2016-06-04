/**
 * dependencies
 */

var Marionette  = require('backbone.marionette'),
    opn         = require('opn'),
    _           = require('lodash'),
    PluginModel = require('../models/plugin');


/**
 * super constructor
 */

var Super = Marionette.ItemView;


/**
 * PluginsRowView
 *
 * @help http://marionettejs.com/docs/v2.5.6/marionette.compositeview.html
 */

var PluginsRowView = Super.extend({


  /**
   * pre-compiled handlebars template
   */

  template: require('../templates/plugins-row'),


  /**
   * view's model
   */

  model: new PluginModel(),


  /**
   * view's DOM element tag name
   */

  tagName: 'tr',


  /**
   * bind DOM events to functions
   */

  events: {
    'click a.btnOpenWebsite': 'openPluginWebsite'
  },


  /**
   * triggered at
   */

  initialize: function() {

    // require jQuery dependencies
    require('../assets/js/bootstrap');
    require('../assets/js/bootstrap-switch');

  },


  /**
   * triggered after the view has been rendered
   */

  onRender: function() {

    // initialize plugin's switch
    this.$el.find('input[type="checkbox"]').bootstrapSwitch({
      size: 'mini',
      inverse: true,
      onText: '<i class="fa fa-check" />',
      onColor: 'success',
      offText: '<i class="fa fa-times" />',
      offColor: 'warning',
      onSwitchChange: _.bind(this.togglePlugin, this)
    });

  },


  /**
   * triggered before HTML destruction
   */

  onBeforeDestroy: function() {

    // destroy component and stop events listening
    this.$el.find('input[type="checkbox"]').bootstrapSwitch('destroy');

  },


  /**
   * enable/disable plugin
   *
   * @help http://www.bootstrap-switch.org/options.html
   *
   * @param {*} e             DOM event object
   * @param {Boolean} state   toggle state
   */

  togglePlugin: function(e, state) {

    // save plugin status
    this.model.save({ enabled: state }); // TODO catch error

  },


  /**
   * open plugin's website
   *
   * @param {*} e   DOM event object
   */

  openPluginWebsite: function(e) {

    // prevent url changes
    e.preventDefault();

    // open browser
    opn(this.model.get('url'));

  }


});


/**
 * exports
 */

module.exports = PluginsRowView;
