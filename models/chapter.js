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

    this.pages = new PagesCollection();

    var event = this.get('plugin') + ':page';

    utils.dispatcher.on(event, this.chapters.add, this.chapters); // TODO fix this

  },


  /**
   * get reading status
   *
   * @return {Boolean}
   */

  isRead: function() {

    return !!this.get('isRead');

  }


});


/**
 * exports model
 */

module.exports = ChapterModel;
