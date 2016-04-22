/**
 * dependencies
 */

var _       = require('underscore')
  , moment  = require('moment')
  , Promise = require('bluebird')
  , utils   = require('../libs/utils')
  , builder = require('../libs/builder');


/**
 * perform comics search
 * @param {String} term         searched string
 * @param {Array} langs         languages array
 * @param {Function} callback   callback function
 * @return {Promise}
 */

var searchComics = function(term, langs, callback) {

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

      callback(null, {
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
 * perform comics search
 * @param {Array} terms         searched string
 * @param {Array} langs         languages array
 * @param {Function} callback   callback function
 */

var loadComics = function(terms, langs, callback) {

  Promise.map(terms, function(term) {
    return searchComics(term, langs, callback);
  }).catch(function(err) {
    callback(err);
  }).finally(function() {
    callback();
  });

};


/**
 * load comic's chapters
 * @param {Comic} comic         comic model instance
 * @param {Function} callback   callback function
 */

var loadChapters = function(comic, callback) {

  utils.ajax(comic.get('url'), { dataType: 'html' }).then(function($) {

    $('tr').each(function() {
      var $tr   = $(this)
        , link  = $tr.find('a.chapterLink');

      if (link.length <= 0) return;

      var url = link.attr('href');

      callback(null, {
        language  : comic.get('language'),
        title     : $tr.find('b').html(),
        number    : parseFloat(url.split('/')[4]),
        group     : $tr.find('td.hideM0').find('a').html(),
        url       : 'http://www.mangaeden.com' + url,
        added     : moment($tr.find('td.chapterDate').html(), 'MMM D, YYYY').toDate()
      });
    });

  }).catch(function(err) {

    callback(err);

  }).finally(function() {

    callback();

  });

};


/**
 * load chapter's pages
 * @param {Chapter} chapter     chapter model instance
 * @param {Function} callback   callback function
 */

var loadPages = function(chapter, callback) {

  return utils.ajax(chapter.get('url'), { dataType: 'html' }).then(function($) {

    return $('select#pageSelect option').map(function() {
      return 'http://www.mangaeden.com' + $(this).attr('value');
    }).get();

  }).map(function(url) {

    return utils.ajax(url, { dataType: 'html' }).then(function($) {

      var data = url.split('/');

      callback(null, {
        number: parseInt(data[7], 10),
        url: 'http:' + $('img#mainImg').attr('src')
      });

    });

  }).catch(function(err) {

    callback(err);

  }).finally(function() {

    callback();

  });

};


/**
 * export plugin
 */

module.exports = builder({
  url           : 'http://www.mangaeden.com',
  languages     : [ 'en', 'it' ],
  name          : 'Manga Eden',
  thumbnail     : 'http://cdn.mangaeden.com/images/logo2.png',
  loadComics    : loadComics,
  loadChapters  : loadChapters,
  loadPages     : loadPages
});