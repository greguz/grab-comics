/**
 * dependencies
 */

var queue     = require('queue')
  , _         = require('lodash')
  , Promise   = require('bluebird')
  , needle    = require('needle')
  , sanitize  = require('sanitize-filename')
  , mime      = require('mime-types')
  , path      = require('path')
  , fs        = require('fs');



/*

download:
- all chapter's comic
- single chapter

download as:
- named folder (Naruto >> Chapter 1: the beginning >> 1.jpg)
- CBZ
- CBR ?

 */


// TODO ensure downloads folder with mkdirp




var q = queue({
  //timeout:
});





/**
 * TODO write docs
 *
 * download_folder + comic_title + chapter_number + page_number
 * /home/user/Downloads/Naruto/1: the beginning/1.jpg
 *
 * @param {String..} p
 * @return {String}
 */

var getPath = function(p) {

  // initial reduce value
  var initial = [];

  // reduce definition
  var reduce = function(result, arg) {

    // split path into parts
    var parts = arg.split(path.sep);

    // sanitize all parts
    var sanitized = _.map(parts, function(part) {

      // return sanitized file/directory name
      return sanitize(part, { replacement: replaceChar });

    });

    // concat parts to reduce result
    return result.concat(sanitized);

  };

  // execute reduce on arguments
  var parts = _.reduce(arguments, reduce, initial);

  // return resulting path
  return path.join.apply(path, parts);

};


/**
 * TODO write docs
 *
 * @param {PageModel} page
 * @param {Object} [options]
 * @return {Promise}
 */

var downloadPage = function(page, options) {

  options = _.defaults(options, {

  });

  var chapter = page.getChapter();

  var comic = page.getComic();






  var extension; // TODO get from image url or needle response


  var filename = page.get('number') + '.' + extension;



  var url = page.get('url');

  var needleOptions = {
    output: '/tmp/tux.png'
  };

  return new Promise(function(resolve, reject) {

    needle.get(url, needleOptions, function(err, response, body) {




      var contentType = response.headers[ 'content-type' ];

      var extension = mime.extension(contentType);



      if (err) {
        reject(err);
      } else {
        resolve(body);
      }

    });

  });

};







var downloadChapter = function(chapter, options) {

  return Promise.map(chapter.pages, function(page) {

    return downloadPage(page, options);

  });

};





var downloadComic = function(comic) {

};




var download = function(plugin, comic, chapter, page) {

};
