/**
 * dependencies
 */

var Handlebars  = require('handlebars'),
    _           = require('lodash');


/**
 * strings manipulation utility
 * @help http://handlebarsjs.com/block_helpers.html
 *
 * @param {String} str
 * @param {Object} [options]
 * @param {Boolean} [options.capitalize]
 * @param {Number} [options.truncate]
 * @param {String} [options.omission]
 * @return {String}
 */

var stringHelper = function(str, options) {

  // ensure string type
  str = str.toString();

  // set default options
  options = _.defaults(options, {
    omission: '..'
  });

  // capitalize string
  if (options.capitalize) str = _.capitalize(str);

  // truncate string
  if (options.truncate) str = _.truncate(str, {
    length: options.truncate,
    omission: options.omission
  });

  // return result
  return str;

};


/**
 * handlebars helper registration
 * @help http://handlebarsjs.com/block_helpers.html
 */

Handlebars.registerHelper('string', function(str, options) {

  // call helper directly
  return stringHelper(str, options.hash);

});


/**
 * exports
 */

module.exports = stringHelper;
