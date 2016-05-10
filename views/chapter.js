/**
 * dependencies
 */

var _               = require('lodash')
  , Backbone        = require('backbone')
  , PaginationView  = require('../views/pagination')
  , app             = require('../libs/app');


/**
 * exports view constructor
 */

module.exports = Backbone.View.extend({

  template: require('../templates/chapter'),

  events: {
    'click img': 'nextImage'
  },

  initialize: function(options) {

    this.plugin = app.plugins.findWhere({ $plugin: options.plugin });
    this.comic = this.plugin.comics.findWhere({ $comic: options.comic });

    this.loadChapter(this.comic.chapters.findWhere({ $chapter: parseInt(options.chapter, 10) }));

  },

  unloadChapter: function() {

    if (this.chapter) {
      this.chapter.pages.off(null, null, this);
    }

  },

  loadChapter: function(chapter, page) {

    this.unloadChapter();

    this.$el.find('div#chapterPage').html('');

    this.chapter = chapter;
    this.pageIndex = page || 0;

    this.chapter.pages.on('add', _.debounce(this.renderPage, 300), this);

    this.chapter.loadPages();

    this.renderPage();

  },

  uninitialize: function() {

    this.unloadChapter();

  },

  render: function() {

    this.$el.html(this.template());

    this.pagination = new PaginationView({
      el: '#pagination'
    });

    this.pagination.render();

  },

  renderPage: function() {

    var page = this.chapter.pages.at(this.pageIndex);

    if (!page) return;

    var $img = $('<img />').attr({
      alt           : 'Page ' + page.get('number'),
      src           : page.get('url'),
      'data-number' : page.get('number'),
      width         : '100%',
      height        : 'auto'
    });

    this.$el.find('div#chapterPage').html($img);

  },

  nextImage: function() {

    this.pageIndex++;

    if (this.pageIndex >= this.chapter.pages.length) {
      this.chapter.set('read', true);
      this.nextChapter();
    } else {
      this.renderPage();
    }

  },

  nextChapter: function() {

    var index   = this.comic.chapters.findIndex(this.chapter.pick('$chapter'))
      , chapter = this.comic.chapters.at(++index);

    if (chapter) this.loadChapter(chapter);

  }

});
