/**
 * dependencies
 */

var Handlebars  = require('handlebars'),
    _           = require('lodash');


/**
 * handlebars helper registration
 *
 * @help http://handlebarsjs.com/block_helpers.html
 */

Handlebars.registerHelper('compare', function() {

  // helper arguments
  var args = _.values(arguments);

  // get handlebars options object
  var options = args.pop();

  // valid operators
  var validOperators = [
    '!',
    '!!',
    '>',
    '>=',
    '<',
    '<=',
    '==',
    '===',
    'typeof'
  ];

  var script = '';

  args.forEach(function(arg, index) {

    if (_.isString(arg) && validOperators.indexOf(arg) >= 0) {

      script += arg

    } else {

      script += 'args[' + index + ']';

    }

    script += ' ';

  });

  if (eval(script)) {

    return options.fn(this);

  } else {

    return options.inverse(this);

  }

});
