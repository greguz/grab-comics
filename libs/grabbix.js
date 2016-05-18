// register handlebars helpers
require('../helpers/flag');
require('../helpers/i18next');
require('../helpers/string');

// include jQuery to browser's window
window.jQuery = window.$ = require('jquery');

// customize Backbone.sync (Loki.js integration)
require('./sync');

// utils
var utils = require('./utils');

// header view constructor
var HeaderView = require('../views/header');

// init header instance
var header = new HeaderView({ el: 'header' });

// app exports
module.exports = {
  dispatcher  : utils.dispatcher,
  header      : header,
  plugins     : require('./plugins'),
  config      : require('./config'),
  router      : require('./router'),
  store       : require('./store'),
  utils       : utils
};
