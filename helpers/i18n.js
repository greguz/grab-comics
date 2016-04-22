var Handlebars = require('handlebars');

var i18n = {

  'en': require('../assets/i18n/en'),
  'it': require('../assets/i18n/it')

};

var helper = function(key, options) {
  var lang = (options.hash.language || 'en').toLowerCase();

  if (!i18n[ lang ]) {
    console.warn('Invalid i18n language:', JSON.stringify(lang));
  } else if (!i18n[ lang ][ key ]) {
    console.warn('Invalid i18n key:', JSON.stringify(key));
  } else  {
    return i18n[ lang ][ key ];
  }

  return key.toString();
};

Handlebars.registerHelper('i18n', helper);

module.exports = helper;