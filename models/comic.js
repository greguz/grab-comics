/**
 * dependencies
 */

var _                   = require('lodash')
  , Backbone            = require('backbone')
  , ChaptersCollection  = require('../collections/chapters')
  , utils               = require('../libs/utils');


/**
 * super constructor for this model
 */

var Super = Backbone.Model;


/**
 * ComicModel definition
 * @help http://backbonejs.org/#Model
 */

var ComicModel = Super.extend({


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
    title       : undefined,
    language    : undefined, // ISO 639-1
    id          : undefined,
    url         : undefined,
    thumbnail   : 'assets/img/placeholder.png',
    group       : 'n/d',
    added       : 'n/d',
    release     : 'n/d',
    author      : 'n/d',
    artist      : 'n/d',
    description : '-',
    favorite    : false
  },


  /**
   * model initialization
   *
   * @description function that will be invoked when the model is created
   * @help http://backbonejs.org/#Model-constructor
   */

  initialize: function() {

    this.chapters = new ChaptersCollection();

    var event = this.get('plugin') + ':chapter';

    utils.dispatcher.on(event, this.chapters.add, this.chapters); // TODO fix this

  },


  /**
   * normalize comic title
   *
   * @param {String} [title]      optional title to normalize, default from attributes
   * @param {String} [replace]    invalid chars replacement
   * @return {String}
   */

  getNormalizedTitle: function(title, replace) {

    return utils.normalize(title || this.get('title'), replace);

  },


  /**
   * search into loaded comics
   *
   * @param {String} str    searched string
   * @return {Boolean}
   */

  match: function(str) {

    return utils.match(this.get('title'), str);

  },


  /**
   * get reading status (for loaded comics)
   *
   * @return {Boolean}
   */

  isRead: function() {

    var startValue = true;

    var reduce = function(result, chapter) {
      return result && !!chapter.isRead();
    };

    return this.chapters.reduce(reduce, startValue);

  }


});


/**
 * exports model
 */

module.exports = ComicModel;
