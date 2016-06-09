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

    // model type, used by GUI
    type: 'page'

    // page number starting from 1
    //number: 1,

    // image url
    //url: 'http://www.foo.net/img/my_img.jpg'

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
    var file = this.getDownloadPath({

      // include download path from user's config
      includeDownloadPath: true,

      // sanitize path
      sanitize: true

    });

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
    page.set('downloadProgress', 0);

    // return new promise
    return new Promise(function(resolve, reject) {

      // end process utility
      var done = function(err) {

        // trigger end download event
        page.set('downloadProgress', 100);

        // close promise
        if (err) {

          // save error
          page.set('downloadError', err);

          // reject promise
          reject(err);

        } else {

          // resolve promise
          resolve();

        }

      };

      // send web request
      needle.get(url, needleOptions, function(err, response, body) {

        // reject request error
        if (err) return done(err);

        // get response content-type
        var contentType = response.headers[ 'content-type' ];

        // add extension to file
        file += '.' + mime.extension(contentType);

        // get file directory
        var dir = path.dirname(file);

        // ensure directory existence
        mkdirp(dir, function (err) {

          // reject request error
          if (err) return done(err);

          // write target file
          fs.writeFile(file, body, fsWriteOptions, done);

        });

      });

    });

  }


});


/**
 * exports page constructor
 */

module.exports = PageModel;
