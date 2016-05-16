/**
 * dependencies
 */

var _         = require('lodash')
  , events    = require('events')
  , util      = require('util')
  , Backbone  = require('backbone')
  , Promise   = require('bluebird')
  , needle    = require('needle')
  , sanitize  = require('sanitize-filename')
  , mime      = require('mime-types')
  , path      = require('path')
  , fs        = require('fs');


/**
 * Queue
 * @constructor
 */

var Queue = function() {

  // actual model's queue
  this.models = [];

  // actual executing model
  this.model = null;

};


/**
 * "inherits" from Backbone.Events
 */

_.extend(Queue.prototype, Backbone.Events);


/**
 * return executing model (if exists)
 *
 * @return {*}
 */

Queue.prototype.getModel = function() {

  // return internal model
  return this.model || null;

};


/**
 * get queue executing status
 *
 * @return {Boolean}
 */

Queue.prototype.isExecuting = function() {

  // return internal flag
  return !!this.getModel();

};


/**
 * execute next process (if available)
 *
 * @private
 */

Queue.prototype._next = function() {

  // check if already executing
  if (this.isExecuting()) return;

  // check if there's a model
  if (this.models.length < 1) return;

  // set true the execution flag
  var model = this.model = this.models.shift();

  // notify download start
  this.trigger('download:start', model);

  // save this instance
  var queue = this;

  // start download process
  model.download().then(function() { // on success (no errors)

    // notify success
    queue.trigger('download:success', model);

  }).catch(function(err) { // catch errors

    // notify error
    queue.trigger('download:error', err, model);

  }).finally(function() { // always at the end

    // notify download's end
    queue.trigger('download:end', model);

    // set status to idle
    delete queue.model;

    // try to download next in queue
    queue._next();

  });

};


/**
 * add model to queue

 * @param {*} model
 * @param {Object} [options]
 */

Queue.prototype.push = function(model, options) {

  // add model to queue
  this.models.push(model);

  // try to start next execution
  this._next();

};





/*

download:
- all chapter's comic
- single chapter

download as:
- named folder (Naruto >> Chapter 1: the beginning >> 1.jpg)
- CBZ
- CBR ?

 */







/**
 * exports queue instance
 */

module.exports = new Queue();
