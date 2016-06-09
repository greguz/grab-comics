/**
 * dependencies
 */

var Marionette  = require('backbone.marionette'),
    _           = require('lodash'),
    i18next     = require('i18next');


/**
 * super constructor
 */

var Super = Marionette.ItemView;


/**
 * QueueItemView
 *
 * @help http://marionettejs.com/docs/v2.4.7/marionette.itemview.html
 */

var QueueItemView = Super.extend({


  /**
   * view container element name
   */

  tagName: 'tr',


  /**
   * pre-compiled handlebars template
   */

  template: require('../templates/queue-item'),


  /**
   * bound model events to view methods
   */

  modelEvents: {
    'change:downloadProgress': 'updateProgressBarValue',
    'change:downloadError': 'showDownloadError'
  },


  /**
   * data passed to the template that is rendered
   */

  serializeData: function() {

    // serialize model
    var data = this.model.toJSON();

    // add download path
    data.downloadPath = this.model.getDownloadPath({

      // change separator
      separator: ' - '

    });

    // return serialized data
    return data;

  },


  /**
   * triggered on download progress
   */

  updateProgressBarValue: function() {

    // round progress to 2 decimals
    var progress = _.round(this.model.get('downloadProgress'), 2);

    // get progress bar element
    var $bar = this.$el.find('.progress-bar');

    // update bar width
    $bar.attr({
      'aria-valuenow': progress,
      'style': 'width: ' + _.round(progress) + '%'
    });

    // on download end
    if (progress >= 100) {

      // remove animation
      $bar.removeClass('progress-bar-striped active');

      // add green background
      $bar.addClass('progress-bar-success');

      // add success text
      $bar.html(i18next.t('downloadSuccess'));

    }

  },


  /**
   * triggered on download error
   */

  showDownloadError: function() {

    // ensure error
    if (!this.model.has('downloadError')) return;

    // get error object
    var err = this.model.get('downloadError');

    // get progress bar element
    var $bar = this.$el.find('.progress-bar');

    // set danger class
    $bar.attr('class', 'progress-bar progress-bar-danger');

    // add error text
    $bar.html('<b>' + err.toString() + '</b>');

  }


});


/**
 * exports
 */

module.exports = QueueItemView;
