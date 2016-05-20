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
 * fetch and cache the complete list of available manga
 *
 * @param {String} [language]   language, default 'en'
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
 * search manga by text
 *
 * @param {String} title        searched text
 * @param {String} [language]   language, default 'en'
 * @return {Promise}
 */

var searchTitle = function(title, language) {

  // set default language
  language = language || 'en';

  // manga url's template
  var template = _.template('http://www.mangaeden.com/<%= language %>/<%= language %>-manga/<%= title %>/');

  // load manga list
  return loadMangaList(language).then(function(data) {

    // get manga that match to searched text
    var filtered = _.filter(data.manga, function(manga) {

      // check if this manga has at least one chapter
      if (!manga.ld) return false;

      // match searched title with manga title
      return utils.match(title, manga.a);

    });

    // map manga data to manga page's url
    return _.map(filtered, function(manga) {

      // return compiled template
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

  // each languages
  Promise.map(languages, function(language) {

    // start title searching
    return searchTitle(title, language).map(function(url) {

      // get manga's page HTML
      return utils.ajax(url, { dataType: 'html' }).then(function($) {

        var author, artist;

        // get author and artist from description box on page's right
        $('.rightBox a').each(function() {
          var $a = $(this);

          if ($a.attr('href').indexOf('?author=') >= 0) {
            author = $a.text();
          } else if ($a.attr('href').indexOf('?artist=') >= 0) {
            artist = $a.text();
          }
        });

        // add comic to collection
        add({
          author      : author,
          artist      : artist,
          url         : url,
          language    : url.indexOf('/it-manga/') >= 0 ? 'it' : 'en',
          title       : $('.manga-title').text(),
          description : $('#mangaDescription').text(),
          thumbnail   : 'http:' + $('div.mangaImage2 img').attr('src')
        });

      });

    }, {

      // set max mapped promises concurrency
      concurrency: 3

    });

  }).then(function() {

    // no errors end
    end();

  }).catch(function(err) {

    // notify error
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

      var number = url.split('/')[4];

      var title = $tr.find('b').text();

      if (_.startsWith(title, number)) title = title.substr(number.length).trim();

      if (_.startsWith(title, ':')) title = title.substr(1).trim();

      add({
        language  : comic.get('language'),
        title     : title,
        number    : parseFloat(number),
        group     : $tr.find('td.hideM0').find('a').text(),
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

  // label used by GUI
  name: 'Manga Eden',

  // thumbnail image used into gallery
  thumbnail: 'http://cdn.mangaeden.com/images/logo2.png',

  // short description
  description: 'Manga Eden plugin for GRABBIX',

  // plugin creator credits
  credits: 'greguz',

  // direction of the overall page organization: 'LTR' or 'RTL'
  pageDirection: 'RTL',

  // TODO write docs
  searchComics: searchComics,

  // TODO write docs
  loadChapters: loadChapters,

  // TODO write docs
  loadPages: loadPages

};
