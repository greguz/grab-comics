/**
 * dependencies
 */

var _             = require('underscore')
  , Backbone      = require('backbone')
  , Handlebars    = require('handlebars')
  , $             = require('jquery')
  , app           = require('../libs/app')
  , galleryTpl    = require('../templates/gallery')
  , thumbnailTpl  = require('../templates/thumbnail');


/**
 * exports view constructor
 */

module.exports = Backbone.View.extend({

  template: galleryTpl(Handlebars),

  initialize: function(options) {

    this.terms = _.uniq(options.terms);
    this.langs = _.uniq(options.langs);
    this.plugin = options.plugin;

    this.plugin.on('error', function(err) {
      $.notify({
        icon: 'glyphicon glyphicon-warning-sign',
        message: err.toString(),
        url: null
      }, {
        type: "danger"
      });
    }, this);

    var selector = '#' + this.plugin.get('$plugin');

    if (this.$el.find(selector).length <= 0) {
      this.$el.prepend(this.template({ plugin: this.plugin.toJSON() }));
    }

    this.setElement(this.$el.find(selector));

  },

  uninitialize: function() {

    this.plugin.off('error', null, this);

  },

  load: function(terms, langs) {

    terms = terms || this.terms;
    langs = langs || this.langs;

    var gallery = this
      , plugin  = this.plugin
      , comics  = plugin.comics;

    gallery.loading = true;
    gallery.loader();

    comics.off(null, null, gallery);

    comics.on('sort', gallery.refresh, gallery);
    comics.on('add', gallery.add, gallery);

    plugin.loadComics(terms, langs, function() {
      comics.off(null, null, gallery);
      gallery.loading = false;
    });

  },

  loader: function() {

    var $title = this.$el.find('.title');

    if (this.loading) {
      $title.fadeToggle(750, null, this.loader.bind(this));
    } else {
      $title.fadeIn(750);
    }

  },

  render: function(options) {

    options = options || {};

    var self = this;

    this.terms = _.uniq(options.terms || this.terms);
    this.langs = _.uniq(options.langs || this.langs);

    this.$el.find('.justified-gallery').html('');

    this.terms.forEach(function(term) {

      self.plugin.comics.each(function(comic) {
        var lMatch = self.langs.indexOf(comic.get('language')) >= 0
          , tMatch = comic.match(term);

        if (lMatch && tMatch) self.add(comic);
      });

    });

    this.refresh();

    this.load();

  },

  add: function(comic) {

    var $gallery = this.$el.find('.justified-gallery');

    if ($gallery.find('#' + comic.get('$comic')).length > 0) return;

    var $comic = $(thumbnailTpl(Handlebars)({
      plugin: this.plugin.toJSON(),
      comic: comic.toJSON()
    }));

    $comic.find('img').error(function() {
      $(this).attr('src', 'assets/img/placeholder.png');
    });

    $gallery.append($comic);

    this.refresh();

  },

  refresh: _.debounce(function() {

    this.$el.find('.justified-gallery').justifiedGallery({
      rowHeight: 200,
      margins: 1,
      captionSettings: {
        animationDuration: 250,
        visibleOpacity: 0.9,
        nonVisibleOpacity: 0.0
      },
      sort: _.bind(function(t1, t2) {
        var i1 = this.plugin.comics.findIndex({ $comic: t1.id })
          , i2 = this.plugin.comics.findIndex({ $comic: t2.id });

        if (i1 > i2) {
          return 1;
        } else if (i1 > i2) {
          return -1;
        } else {
          return 0;
        }
      }, this)
    });

  }, 250),

  addTerm: function(term) {

    var args = _.values(arguments);

    this.terms = this.terms.concat(args);

    this.load(args);

  },

  removeTerm: function(term) {

    // TODO remove comics from gallery

  },

  addLang: function(lang) {

    var args = _.values(arguments);

    this.langs = this.langs.concat(args);

    this.load(null, args);

  },

  removeLang: function(lang) {

    var args = _.values(arguments);

    this.langs = _.difference(this.langs, args);

    _.each(args, function(lang) {
      this.$el.find('[data-language="' + lang + '"]').remove();
    }, this);

    this.refresh();

  }

});