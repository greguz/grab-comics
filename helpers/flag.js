/**
 * dependencies
 */

var Handlebars  = require('handlebars')
  , $           = require('jquery')
  , _           = require('underscore');


/**
 * get flag icon
 * @param {String} code       ISO 639-1 code
 * @param {Object} options    handlebars options object
 * @return {*}
 */

var helper = function(code, options) {
  var iso3166, res = $('<span class="flag-icon"></span>');

  switch (code) { // cast to ISO 3166-1-alpha-2

    case 'en':
      iso3166 = 'gb'; break;

    default:
      iso3166 = code.toLowerCase(); break;

  }

  res.addClass('flag-icon-' + iso3166);

  _.each(options.hash, function(value, field) {
    if (field === 'squared') {
      if (value) res.addClass('flag-icon-squared')
    } else if (field === 'class') {
      res.addClass(value);
    } else {
      res.attr(field, value);
    }
  });

  return new Handlebars.SafeString(res.prop('outerHTML'));
};


/**
 * register helper to handlebars
 */

Handlebars.registerHelper('flag', helper);


/**
 * export helper function
 */

module.exports = helper;