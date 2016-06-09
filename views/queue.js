/**
 * dependencies
 */

var Marionette = require('backbone.marionette');


/**
 * super constructor
 */

var Super = Marionette.CompositeView;


/**
 * QueueView
 *
 * @help http://marionettejs.com/docs/v2.4.7/marionette.compositeview.html
 */

var QueueView = Super.extend({

  tagName: 'table',

  attributes: {
    class: 'table table-striped table-condensed'
  },

  template: require('../templates/queue'),

  childView: require('../views/queue-item'),

  childViewContainer: 'tbody'

});


/**
 * exports
 */

module.exports = QueueView;
