/**
 * dependencies
 */

var Handlebars      = require('handlebars')
  , i18next         = require('i18next')
  , i18nextBackend  = require('i18next-node-fs-backend')
  , _               = require('lodash');


/**
 * i18next initialization and configuration
 *
 * @help http://i18next.com/docs/options/#init-options
 */

var config = { // TODO load i18next config from store

  // array of allowed languages
  whitelist: [ 'en', 'it' ],

  // language to set (disables user language detection)
  lng: 'en',

  // language to lookup key if not found on set language
  fallbackLng: 'en',

  // default namespace used if not passed to translation function
  defaultNS: 'translation',

  // char, eg. ‘\n’ that arrays will be joined by
  joinArrays: ', ',

  // calls save missing key function on backend if key not found
  saveMissing: false,

  // configuration for i18next-node-fs-backend
  backend: {

    // path where resources get loaded from
    loadPath: process.cwd() + '/locales/{{lng}}.json',

    // path to post missing resources
    addPath: process.cwd() + '/locales/{{lng}}.missing.json',

    // jsonIndent to use when storing json files
    jsonIndent: 2

  }

};

i18next.use(i18nextBackend).init(config);


/**
 * handlebars helper registration
 *
 * @help http://handlebarsjs.com/block_helpers.html
 */

Handlebars.registerHelper('i18n', function(key, options) {

  // add root to key
  if (options.hash.root) key = options.hash.root + i18next.options.keySeparator + key;

  // call i18next.t directly
  return i18next.t(key, _.omit(options.hash, 'root'));

});


/**
 * exports
 */

module.exports = i18next;
