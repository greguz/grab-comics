/**
 * dependencies
 */

var Promise = require('bluebird'),
    needle  = require('needle'),
    mime    = require('mime-types'),
    path    = require('path'),
    fs      = require('fs'),
    mkdirp  = require('mkdirp');


/**
 * super constructor for this model
 */

var Super = require('./super');


/**
 * page model definition
 */

var PageModel = Super.extend({


  /**
   * loki.js target collection name for plugin saving
   */

  lokiCollection: 'pages',


  /**
   * set ID field name
   *
   * @description model's unique identifier
   * @help http://backbonejs.org/#Model-idAttribute
   */

  idAttribute: '$loki',


  /**
   * defaults
   *
   * @description used to specify the default attributes for your model
   * @help http://backbonejs.org/#Model-defaults
   */

  defaults: {
    number  : undefined,
    url     : undefined
  },


  /**
   * return target folder name for this model
   *
   * @return {String}
   */

  getFolder: function() {

    // return page's number
    return this.get('number').toString();

  },


  /**
   * download page
   *
   * @return {Promise}
   */

  download: function() {

    // this instance
    var page = this;

    // target file path (no extension)
    var file = this.getDownloadPath();

    // image's url
    var url = this.get('url');

    // request options
    var needleOptions = {
      decode: false,
      parse: false,
      parse_cookies: false
    };

    // fs.writeFile options
    var fsWriteOptions = null;

    // trigger start download event
    page.trigger('download:start', file);

    // return new promise
    return new Promise(function(resolve, reject) {

      // end process utility
      var end = function(err) {

        // trigger end download event
        page.trigger('download:end', err || file);

        // close promise
        if (err) reject(err); else resolve();

      };

      // send web request
      needle.get(url, needleOptions, function(err, response, body) { // TODO remove needle

        // reject request error
        if (err) return end(err);

        // get response content-type
        var contentType = response.headers[ 'content-type' ];

        // add extension to file
        file += '.' + mime.extension(contentType);

        // get file directory
        var dir = path.dirname(file);

        // ensure directory existence
        mkdirp(dir, function (err) {

          // reject request error
          if (err) return end(err);

          // write target file
          fs.writeFile(file, body, fsWriteOptions, end);

        });

      });

    });

  }


});


/**
 * exports page constructor
 */

module.exports = PageModel;
