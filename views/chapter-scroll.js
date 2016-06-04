/**
 * dependencies
 */

var Marionette            = require('backbone.marionette'),
    ChapterScrollPageView = require('../views/chapter-scrollPage');


/**
 * super constructor
 */

var Super = Marionette.CompositeView;


/**
 * ChapterScrollView
 *
 * @help http://marionettejs.com/docs/v2.4.7/marionette.compositeview.html
 */

var ChapterScrollView = Super.extend({

  tagName: 'div',

  attributes: {
    class: 'container text-center'
  },

  template: require('../templates/chapter-scroll'),

  childView: ChapterScrollPageView,

  childViewContainer: '#pages',

  events: {
    'click #btnPreviousChapter': 'previousChapter',
    'click #btnNextChapter': 'nextChapter'
  },

  initialize: function() {
    this.model.loadPages();
  },

  previousChapter: function() {

  },

  nextChapter: function() {

  }

});


/**
 * exports
 */

module.exports = ChapterScrollView;
