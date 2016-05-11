/**
 * dependencies
 */

var Handlebars  = require('handlebars')
  , $           = require('jquery')
  , _           = require('lodash');


/**
 * get flag icon's jQuery element
 * @help http://handlebarsjs.com/block_helpers.html
 *
 * @param {String} code
 * @param {Object} [options]
 * @param {Boolean} [options.squared]   add flag-icon-squared class
 * @param {String} [options.class]      add other classes to element
 * @return {jQuery}
 */

var flagHelper = function(code, options) {

  // set default options
  options = _.defaults(options, {});

  // create result jQuery element
  var res = $('<span class="flag-icon"></span>');

  // ISO-3166-1-alpha-2 result code
  var iso3166;

  // cast ISO-639-1 code to ISO 3166-1-alpha-2
  switch (code) {

    // i dress to kill, but tastefully - Freddie Mercury
    case 'en':
      iso3166 = 'gb'; break;

    // default casted code
    default:
      iso3166 = code.trim().substr(0, 2).toLowerCase(); break;

  }

  // add language class
  res.addClass('flag-icon-' + iso3166);

  // add "squared flag" class
  if (options.squared) res.addClass('flag-icon-squared');

  // add custom class
  if (options.class) res.addClass(options.class);

  // get other options
  var attributes = _.omit(options, 'squared', 'class');

  // set others attributes
  res.attr(attributes);

  // return jQuery element
  return res;

};


/**
 * handlebars helper registration
 * @help http://handlebarsjs.com/block_helpers.html
 */

Handlebars.registerHelper('flag', function(code, options) {

  // get jQuery element
  var $el = flagHelper(code, options.hash);

  // return (escaped) element HTML
  return new Handlebars.SafeString($el.prop('outerHTML'));

});


/**
 * exports
 */

module.exports = flagHelper;
