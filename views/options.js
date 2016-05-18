/**
 * dependencies
 */

var _         = require('lodash')
  , Backbone  = require('backbone')
  , opn       = require('opn')
  , grabbix   = require('../libs/grabbix');


/**
 * super view constructor
 */

var Super = Backbone.View;


/**
 * OptionsView definition
 *
 * @help http://backbonejs.org/#View-extend
 */

var OptionsView = Super.extend({


  /**
   * specify a set of DOM events that will be bound to methods
   *
   * @help http://backbonejs.org/#View-events
   */

  events: {
    'click a.btnOpenWebsite': 'openPluginWebsite'
  },


  /**
   * handlebars compiled template function
   *
   * @help http://backbonejs.org/#View-template
   * @help http://handlebarsjs.com/
   */

  template: require('../templates/options'),


  /**
   * init internal parameters and start events listening
   *
   * @description function called when the view is first created
   * @help http://backbonejs.org/#View-constructor
   *
   * @return {OptionsView}
   */

  initialize: function() {

    // require jQuery dependencies
    require('../assets/js/bootstrap');
    require('../assets/js/bootstrap-switch');

    // return this instance
    return this;

  },


  /**
   * load options and render
   *
   * @help http://miromannino.github.io/Justified-Gallery/options-and-events/
   * @help https://lodash.com/docs#debounce
   *
   * @return {OptionsView}
   */

  render: function() {

    // template data object
    var data = {
      languages: grabbix.plugins.getLanguages(),
      plugins: grabbix.plugins.toJSON(),
      config: grabbix.config.toJSON()
    };

    // render template
    this.$el.html(this.template(data));

    // initialize plugin's switches
    this.$el.find('input[type="checkbox"]').bootstrapSwitch({
      size: 'mini',
      inverse: true,
      onText: '<i class="fa fa-check" />',
      onColor: 'success',
      offText: '<i class="fa fa-times" />',
      offColor: 'warning',
      onSwitchChange: this.togglePlugin.bind(this)
    });

    // return this instance
    return this;

  },


  /**
   * get plugin by DOM event
   *
   * @param {*} e             DOM event object
   * @return {PluginModel}
   */

  getPlugin: function(e) {

    // get plugin id from DOM
    var pluginID = $(e.target).closest('tr').attr('data-plugin');

    // return plugin instance
    return grabbix.plugins.findWhere({ id: pluginID });

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

    // get plugin instance
    var plugin = this.getPlugin(e);

    // save plugin status
    plugin.save({ enabled: state }); // TODO log error

  },


  /**
   * open plugin's website
   *
   * @param {*} e   DOM event object
   */

  openPluginWebsite: function(e) {

    // prevent url changes
    e.preventDefault();

    // get plugin instance
    var plugin = this.getPlugin(e);

    // get plugin's url
    var url = plugin.get('url');

    // open browser
    opn(url);

  }


});


/**
 * exports
 */

module.exports = OptionsView;
