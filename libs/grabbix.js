/**
 * template's helpers inclusion
 */

require('../helpers/flag');
require('../helpers/i18next');
require('../helpers/string');


/**
 * jquery plugins inclusion
 */

window.jQuery = window.$ = require('jquery');

require('../assets/js/jquery.justifiedGallery');
require('../assets/js/bootstrap');
require('../assets/js/bootstrap-switch');
require('../assets/js/bootstrap-multiselect');
require('../assets/js/bootstrap-notify');


/**
 * Backbone.sync customization
 */

require('./sync');


/**
 * global components settings
 */

var utils       = require('./utils')
  , HeaderView  = require('../views/header');

var header = new HeaderView({ el: 'header' });


/**
 * exports
 */

module.exports = {
  dispatcher  : utils.dispatcher,
  header      : header,
  plugins     : require('./plugins'),
  config      : require('./config'),
  router      : require('./router'),
  store       : require('./store'),
  utils       : utils
};
