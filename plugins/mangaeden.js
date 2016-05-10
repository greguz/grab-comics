/**
 * dependencies
 */

var _       = require('lodash')
  , moment  = require('moment')
  , Promise = require('bluebird')
  , utils   = require('../libs/utils');


/**
 * TODO write docs
 *
 * @param {String} term         searched text
 * @param {Array} languages     requested languages array
 * @param {Function} callback   xx
 */

var searchComicsTerm = function(term, languages, callback) {

  var keys    = utils.normalize(term).split(' ')
    , params  = [];

  _.each(keys, function(key) {
    params.push(encodeURIComponent(key));
  });

  var url = 'http://www.mangaeden.com/ajax/search-manga/?term=' + params.join('+');

  return utils.ajax(url, { dataType: 'json' }).then(function(response) {
    var urls = [];

    _.each(response, function(data) {
      var lang;

      if (/^\/en-manga/.test(data.url)) {
        lang = 'en';
      } else if (/^\/it-manga/.test(data.url)) {
        lang = 'it';
      }

      if (langs.indexOf(lang) >= 0) urls.push('http://www.mangaeden.com/' + lang + data.url);
    });

    return urls;
  }).map(function(url) {

    return utils.ajax(url, { dataType: 'html' }).then(function($) {

      var author, artist;

      $('.rightBox a').each(function() {
        var $a = $(this);

        if ($a.attr('href').indexOf('?author=') >= 0) {
          author = $a.html();
        } else if ($a.attr('href').indexOf('?artist=') >= 0) {
          artist = $a.html();
        }
      });

      callback({
        author      : author,
        artist      : artist,
        url         : url,
        language    : url.indexOf('/it-manga/') >= 0 ? 'it' : 'en',
        title       : $('.manga-title').html(),
        description : $('#mangaDescription').text(),
        thumbnail   : 'http:' + $('div.mangaImage2 img').attr('src')
      });

    });

  });

};


/**
 * TODO write docs
 *
 * @param {Array} terms       searched terms
 * @param {Array} languages   requested languages array
 * @param {Function} add      add comic callback
 * @param {Function} end      process end callback
 */

var searchComics = function(terms, languages, add, end) {

  Promise.map(terms, function(term) {
    return searchComicsTerm(term, languages, add);
  }).then(function() {
    end();
  }).catch(function(err) {
    end(err);
  });

};


/**
 * TODO write docs
 *
 * @param {ComicModel} comic    comic model instance
 * @param {Function} add        add chapter callback
 * @param {Function} end        process end callback
 */

var loadChapters = function(comic, add, end) {

  utils.ajax(comic.get('url'), { dataType: 'html' }).then(function($) {

    $('tr').each(function() {
      var $tr   = $(this)
        , link  = $tr.find('a.chapterLink');

      if (link.length <= 0) return;

      var url = link.attr('href');

      add({
        language  : comic.get('language'),
        title     : $tr.find('b').html(),
        number    : parseFloat(url.split('/')[4]),
        group     : $tr.find('td.hideM0').find('a').html(),
        url       : 'http://www.mangaeden.com' + url,
        added     : moment($tr.find('td.chapterDate').html(), 'MMM D, YYYY').toDate()
      });
    });

  }).then(function() {

    end();

  }).catch(function(err) {

    end(err);

  });

};


/**
 * TODO write docs
 *
 * @param {ChapterModel} chapter    chapter model instance
 * @param {Function} add            add page callback
 * @param {Function} end            process end callback
 */

var loadPages = function(chapter, add, end) {

  return utils.ajax(chapter.get('url'), { dataType: 'html' }).then(function($) {

    return $('select#pageSelect option').map(function() {
      return 'http://www.mangaeden.com' + $(this).attr('value');
    }).get();

  }).map(function(url) {

    return utils.ajax(url, { dataType: 'html' }).then(function($) {

      var data = url.split('/');

      add({
        number: parseInt(data[7], 10),
        url: 'http:' + $('img#mainImg').attr('src')
      });

    });

  }).then(function() {

    end();

  }).catch(function(err) {

    end(err);

  });

};


/**
 * exports
 */

module.exports = {

  // unique id for plugin identification
  id: 'mangaeden',

  // available languages for this plugin
  languages: [ 'en', 'it' ],

  // website url for credits
  url: 'http://www.mangaeden.com/',

  // label used by GUI, default from ID
  name: 'Manga Eden',

  // thumbnail image used into gallery
  thumbnail: 'http://cdn.mangaeden.com/images/logo2.png',

  // short description
  description: 'Manga Eden plugin for GRABBIX',

  // plugin creator credits
  credits: 'greguz',

  // TODO write docs
  searchComics: searchComics,

  // TODO write docs
  loadChapters: loadChapters,

  // TODO write docs
  loadPages: loadPages

};
