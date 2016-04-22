/**
 * dependencies
 */

var ChapterModel        = require('../models/chapter')
  , ChaptersCollection  = require('../collections/chapters')
  , ComicModel          = require('../models/comic')
  , ComicsCollection    = require('../collections/comics')
  , PluginModel         = require('../models/plugin');


/**
 * build plugin utility
 * @param {Object} options
 * @param {String} options.url              web site url
 * @param {Array} options.languages         available languages
 * @param {String} [options.name]           plugin name
 * @param {String} [options.description]    plugin description
 * @param {String} [options.thumbnail]      web site logo
 * @param {String} [options.id]
 * @param {Function} options.loadComics
 * @param {Function} options.loadChapters
 * @param {Function} options.loadPages
 * @return {Plugin}
 */

module.exports = function(options) {

  var Chapter = ChapterModel.extend({
    _loadPages: options.loadPages
  });

  var Chapters = ChaptersCollection.extend({
    model: Chapter
  });

  var Comic = ComicModel.extend({
    Collection: Chapters,
    _loadChapters: options.loadChapters
  });

  var Comics = ComicsCollection.extend({
    model: Comic
  });

  var Plugin = PluginModel.extend({
    Collection: Comics,
    _loadComics: options.loadComics
  });

  var regex = /(http|https):\/\/(www\.)?(.*)\.(.*)\/?/;

  return new Plugin({
    $plugin     : options.id || options.url.replace(regex, '$3'),
    url         : options.url,
    languages   : options.languages,
    name        : options.name,
    description : options.description,
    thumbnail   : options.thumbnail
  });

};