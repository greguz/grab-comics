/**
 * dependencies
 */

var _       = require('lodash')
  , moment  = require('moment')
  , Promise = require('bluebird')
  , utils   = require('../libs/utils');


/**
 * global vars
 */

var cache = {};


/**
 * TODO write docs
 *
 * @param {String} [language]
 * @return {Promise}
 */

var loadMangaList = function(language) {

  // ensure language
  language = language || 'en';

  // if cached return
  if (cache[ language ]) return Promise.resolve(cache[ language ]);

  // set invalidate cache timeout
  setTimeout(function() {

    // invalidate cache
    delete cache[ language ];

  }, 60 * 60 * 1000); // 1h

  // get language ID
  var langID = language === 'it' ? 1 : 0;

  // api url (see mangaeden docs)
  var api = 'https://www.mangaeden.com/api/list/' + langID + '/';

  // launch web request
  return utils.ajax(api, { dataType: 'json' }).then(function(data) {

    // save result to cache and return
    return cache[ language ] = data;

  });

};


/**
 * TODO write docs
 *
 * @param {String} title
 * @param {String} [language]
 * @return {Promise}
 */

var searchTitle = function(title, language) {

  language = language || 'en';

  var template = _.template('http://www.mangaeden.com/<%= language %>/<%= language %>-manga/<%= title %>/');

  return loadMangaList(language).then(function(data) {

    var filtered = _.filter(data.manga, function(manga) {
      return utils.match(title, manga.a);
    });

    return _.map(filtered, function(manga) {
      return template({
        language: language,
        title: manga.a
      });
    });

  });

};


/**
 * start plugin-specific code to search comics
 *
 * @param {String} title      searched title
 * @param {Array} languages   requested languages
 * @param {Function} add      function to invoke with comic's attributes
 * @param {Function} end      function to invoke at the end of searching process
 */

var searchComics = function(title, languages, add, end) {

  var urls = [];

  Promise.each(languages, function(language) {

    return searchTitle(title, language).then(function(matching) {

      urls = urls.concat(matching);

    });

  }).then(function() {

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

      add({
        author      : author,
        artist      : artist,
        url         : url,
        language    : url.indexOf('/it-manga/') >= 0 ? 'it' : 'en',
        title       : $('.manga-title').html(),
        description : $('#mangaDescription').text(),
        thumbnail   : 'http:' + $('div.mangaImage2 img').attr('src')
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
  url: 'http://www.mangaeden.com',

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
