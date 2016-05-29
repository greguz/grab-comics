/**
 * dependencies
 */

var Handlebars = require('handlebars');


/**
 * handlebars helper registration
 *
 * @help http://handlebarsjs.com/block_helpers.html
 */

Handlebars.registerHelper('exists', function(element, collection, options) {

  // TODO

  if (collection.indexOf(element) >= 0) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }

});
