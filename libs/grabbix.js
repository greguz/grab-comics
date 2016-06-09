/**
 * dependencies
 */

var $           = require('jquery'),
    requireDir  = require('require-dir'),
    _           = require('lodash'),
    Backbone    = require('backbone'),
    Marionette  = require('backbone.marionette'),
    Radio       = require('backbone.radio'),
    app         = require('./application'),
    Mediator    = require('./mediator'),
    Router      = require('./router');


/**
 * handlebars helpers registration
 */

requireDir('../helpers');


/**
 * jQuery components fix
 */

// ensure jQuery object saved to window
window.jQuery = window.$ = $;


/**
 * framework configurations
 */

// customize Backbone.sync function for Loki.js integration
require('./sync');

// define templates render function for pre-compiled templates
Marionette.Renderer.render = function(template, data) {
  return template(data);
};

// a shim to replace Backbone.Wreqr with Backbone.Radio in Marionette
Marionette.Application.prototype._initChannel = function() {
  this.channelName = _.result(this, 'channelName') || 'global';
  this.channel = _.result(this, 'channel') || Radio.channel(this.channelName);
};


/**
 * start application
 */

// listen application "ready" event
app.on('start', function() {

  // get routes controller
  var controller = new Mediator();

  // create app and init router
  controller.router = new Router({
    controller: controller
  });

  // save controller into app object
  app.controller = controller;

  // init controller
  controller.start();

  // start url monitoring
  Backbone.history.start();

});

// load config model
require('./config');

// open "DB" connection
require('./store');

// wait store initialization
Radio.channel('store').once('ready', function() {

  // start application
  app.start();

});


/**
 * exports
 */

module.exports = app;
