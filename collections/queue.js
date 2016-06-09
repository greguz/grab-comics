/**
 * dependencies
 */

var Backbone  = require('backbone'),
    Radio     = require('backbone.radio'),
    _         = require('lodash');


/**
 * super constructor
 */

var Super = Backbone.Collection;


/**
 * QueueCollection
 *
 * @help http://backbonejs.org/#Collection
 */

var QueueCollection = Super.extend({


  /**
   * loki.js target collection name
   */

  lokiCollection: 'downloads',


  /**
   * set field "id" as identifier (instead of "$loki")
   *
   * @description return the value the collection will use to identify a model
   * @help http://backbonejs.org/#Collection-modelId
   */

  modelId: _.property('id'),


  /**
   * triggered on collection creation
   *
   * @description function that will be invoked when the collection is created
   * @help http://backbonejs.org/#Collection-constructor
   */

  initialize: function() {

    // get queue channel
    var queueChannel = Radio.channel('queue');

    // add to queue from radio event
    queueChannel.on('add', this.add, this);

    // download on collection's add event
    this.on('add', this.onAdd, this);

  },


  /**
   * triggered on new model
   */

  onAdd: function(model) {

    // set download progress to "queued"
    model.set('downloadProgress', 0);

    // start downloading process
    this.downloadNext();

  },


  /**
   * download next model in queue
   */

  downloadNext: function() {

    // do not download if already downloading
    if (this.isDownloading()) return;

    // get first "waiting in queue" model
    var model = this.find(function(model) {

      // check progress
      return model.get('downloadProgress') === 0;

    });

    // ensure model exists
    if (!model) return;

    // set downloading model flag
    this._downloading = model;

    // this instance
    var queue = this;

    // start model download
    model.download().then(function() {

      // TODO notify success using native API
      console.log('ok');

    }).catch(function(err) {

      // TODO notify error using native API
      console.log(err);

    }).finally(function() {

      // clean downloading flag
      delete queue._downloading;

      // download next model
      queue.downloadNext();

    });

  },


  /**
   * get downloading status
   *
   * @return {Boolean}
   */

  isDownloading: function() {

    return !!this._downloading;

  }


});


/**
 * exports collection
 */

module.exports = QueueCollection;
