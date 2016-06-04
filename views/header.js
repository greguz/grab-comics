/**
 * dependencies
 */

var Backbone    = require('backbone'),
    Marionette  = require('backbone.marionette'),
    Radio       = require('backbone.radio'),
    i18next     = require('i18next'),
    _           = require('lodash');


/**
 * radio channel
 */

var headerChannel = Radio.channel('header');


/**
 * super constructor
 */

var Super = Marionette.ItemView;


/**
 * HeaderView
 *
 * @help http://marionettejs.com/docs/v2.4.5/marionette.itemview.html
 */

var HeaderView = Super.extend({


  /**
   * template used by render
   */

  template: require('../templates/header'),


  /**
   * bind DOM events to view's functions
   */

  events: {
    'keyup': 'onKeyUp',
    'click input': 'selectAllText'
  },


  /**
   * view data model
   */

  model: new Backbone.Model(),


  /**
   * bind model events to view's functions
   */

  modelEvents: {
    'change:title': 'search'
  },


  /**
   * called immediately after the Object has been instantiated
   */

  initialize: function() {

    // ensure bootstrap is loaded
    require('../assets/js/bootstrap');

    // listen for lang changes
    i18next.on('languageChanged', _.bind(this.render, this));

  },


  /**
   * triggered after the view has been rendered
   */

  onRender: function() {

    // start affix component
    this.$el.find('#headerBar').affix({

      // pixels to offset from screen when calculating position of scroll
      offset: 51

    });

  },


  /**
   * triggered on keyboard key up
   *
   * @param {*} e   DOM event object
   */

  onKeyUp: function(e) {

    // ENTER button key code
    var ENTER_KEY = 13;

    // get title from input
    var title = this.$el.find('input').val();

    // on enter launch search
    if (e.which === ENTER_KEY) {

      // check if title was changed
      if (this.model.get('title') === title) {

        // call search directly
        this.search();

      } else {

        // update model
        this.model.set('title', title);

      }

    }

  },


  /**
   * triggered on title's change (input box)
   */

  search: function() {

    // notify changed title
    headerChannel.trigger('change:title', this.model.get('title'));

  },


  /**
   * select all text into text input
   *
   * @param {*} e   DOM event object
   */

  selectAllText: function(e) {

    // select all input text
    e.target.select();

  }


});


/**
 * exports
 */

module.exports = HeaderView;
