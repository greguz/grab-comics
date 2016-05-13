/**
 * dependencies
 */

var _         = require('lodash')
  , Backbone  = require('backbone')
  , $         = require('jquery')
  , utils     = require('../libs/utils');


/**
 * super view constructor
 */

var Super = Backbone.View;


/**
 * SearchView definition
 *
 * @help http://backbonejs.org/#View-extend
 */

var HeaderView = Super.extend({


  /**
   * specify a set of DOM events that will be bound to methods
   *
   * @help http://backbonejs.org/#View-events
   */

  events: {
    'click input#searchBox'   : 'selectAll',
    'change input#searchBox'  : 'search'
  },


  /**
   * handlebars compiled template function
   *
   * @help http://backbonejs.org/#View-template
   * @help http://handlebarsjs.com/
   */

  template: require('../templates/header'),



  /**
   * init internal parameters and start events listening
   *
   * @description function called when the view is first created
   * @help http://backbonejs.org/#View-constructor
   *
   * @return {HeaderView}
   */

  initialize: function() {

    // listen for config initialization
    utils.dispatcher.once('config:ready', this.render, this);

    // pre-render
    this.render();

    // return this instance
    return this;

  },


  /**
   * render all galleries
   *
   * @description renders the view template from model data, and updates this.el with the new HTML
   * @help http://backbonejs.org/#View-render
   *
   * @return {HeaderView}
   */

  render: function() {

    // reload all HTML
    this.$el.html(this.template());

    // init tooltips
    this.$el.find('#mainToolbar').find('[data-toggle="tooltip"]').tooltip();

    // return this instance
    return this;

  },


  /**
   * select all text on input's click
   */

  selectAll: function(e) {
    $(e.target).select();
  },


  /**
   * send "search" global event
   */

  search: function(e) {
    utils.dispatcher.trigger('header:search', $(e.target).val());
  }


});


/**
 * exports
 */

module.exports = HeaderView;
