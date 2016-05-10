/**
 * dependencies
 */

var _               = require('lodash')
  , Backbone        = require('backbone')
  , PagesCollection = require('../collections/pages')
  , utils           = require('../libs/utils');



/**
 * super constructor for this model
 */

var Super = Backbone.Model;


/**
 * chapter model definition
 */

var ChapterModel = Super.extend({


  /**
   * set ID field name
   *
   * @description model's unique identifier
   * @help http://backbonejs.org/#Model-idAttribute
   */

  idAttribute: 'id',


  /**
   * defaults
   *
   * @description used to specify the default attributes for your model
   * @help http://backbonejs.org/#Model-defaults
   */

  defaults: {
    number      : undefined, // from 1
    language    : undefined, // ISO 639-1
    title       : undefined,
    description : undefined,
    url         : undefined,
    isRead      : false
  },


  /**
   * model initialization
   *
   * @description function that will be invoked when the model is created
   * @help http://backbonejs.org/#Model-constructor
   */

  initialize: function() {

    // create new pages collection
    var pages = new PagesCollection();

    // "new page" plugin's event
    var event = this.get('plugin') + ':page';

    // start event listening
    utils.dispatcher.on(event, function(page) {

      // check if page is from this chapter
      if (this.get('id') === page.get('chapter')) {

        // save page
        pages.add(page);

      }

    }, this); // bind function to this

    // save pages collection internally
    this.pages = pages;

  },


  /**
   * get reading status
   *
   * @return {Boolean}
   */

  isRead: function() {

    return !!this.get('isRead');

  },


  /**
   * start pages loading
   *
   * @param {Function} [callback]
   */

  loadPages: function(callback) {

    // plugin API event
    var event = this.get('plugin') + ':loadPages';

    // trigger global dispatcher
    utils.dispatcher.trigger(event, this, callback);

  }


});


/**
 * exports model
 */

module.exports = ChapterModel;
