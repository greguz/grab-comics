/**
 * dependencies
 */

var Handlebars  = require('handlebars')
  , _           = require('underscore');


/**
 * get flag icon
 * @param {String} string     string to truncate
 * @param {Number} len        l
 * @param {Object} options    handlebars options object
 */

var helper = function(string, len, options) {
  string = string || '';

  if (string.length > len) {
    string = string.substr(0, len) + '...';
  }

  return new Handlebars.SafeString(string);
};


/**
 * register helper to handlebars
 */

Handlebars.registerHelper('truncate', helper);


/**
 * export helper function
 */

module.exports = helper;