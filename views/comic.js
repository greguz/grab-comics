/**
 * dependencies
 */

var _           = require('lodash')
  , Backbone    = require('backbone')
  , Handlebars  = require('handlebars')
  , $           = require('jquery')
  , comicTpl    = require('../templates/comic')
  , chapterTpl  = require('../templates/comicChapter')
  , app         = require('../libs/app');


/**
 * exports view constructor
 */

module.exports = Backbone.View.extend({

  template: comicTpl(Handlebars),

  initialize: function(options) {

    this.plugin = app.plugins.findWhere({ $plugin: options.plugin });
    this.comic = this.plugin.comics.findWhere({ $comic: options.comic });

    this.comic.chapters.on('add', this.addChapter, this);

    this.comic.loadChapters();

  },

  undelegateEvents: function() {

    Backbone.View.prototype.undelegateEvents.call(this);

    if (this.comic) this.comic.chapters.off(null, null, this);

  },

  addChapter: function(chapter) {

    var index   = this.comic.chapters.findIndex(chapter.pick('$chapter'))
      , $table  = this.$el.find('tbody');

    var $tr = $(chapterTpl(Handlebars)({
      plugin: this.plugin.toJSON(),
      comic: this.comic.toJSON(),
      chapter: chapter.toJSON()
    }));

    if (index <= 0) {
      $table.prepend($tr);
    } else if (++index >= this.comic.chapters.length) {
      $table.append($tr);
    } else {
      // TODO
    }

  },

  render: function() {

    this.$el.html(this.template({
      plugin    : this.plugin.toJSON(),
      comic     : this.comic.toJSON(),
      chapters  : this.comic.chapters.toJSON()
    }));

    this.$el.find('img#thumbnail').error(function() {
      $(this).attr('src', 'assets/img/placeholder.png');
    });

    this.$el.find('#comicSummary').affix({
      offset: 125
    });

    this.comic.chapters.each(this.addChapter, this);

  }

});
