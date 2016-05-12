/**
 * dependencies
 */

var _           = require('lodash')
  , Backbone    = require('backbone')
  , $           = require('jquery')
  , chapterTpl  = require('../templates/comicChapter')
  , grabbix     = require('../libs/grabbix');


/**
 * exports view constructor
 */

module.exports = Backbone.View.extend({

  template: require('../templates/comic'),

  initialize: function(options) {

    this.plugin = grabbix.plugins.findWhere({ id: options.plugin });
    this.comic = this.plugin.comics.findWhere({ id: options.comic });

    this.comic.chapters.on('add', this.addChapter, this);

    this.comic.loadChapters();

  },

  undelegateEvents: function() {

    Backbone.View.prototype.undelegateEvents.call(this);

    if (this.comic) this.comic.chapters.off(null, null, this);

  },

  addChapter: function(chapter) {

    var index   = this.comic.chapters.findIndex(chapter.pick('id'))
      , $table  = this.$el.find('tbody');

    var $tr = $(chapterTpl({
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
