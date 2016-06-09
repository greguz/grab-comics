/**
 * dependencies
 */

var Marionette        = require('backbone.marionette'),
    Radio             = require('backbone.radio'),
    QueueCollection   = require('../collections/queue'),
    PluginsCollection = require('../collections/plugins'),
    app               = require('./application');


/**
 * Mediator
 *
 * @help http://marionettejs.com/docs/v2.4.5/marionette.object.html
 */

var Mediator = Marionette.Object.extend({


  /**
   * fired right after "start" function call
   */

  initialize: function() {

    // create download's queue collection
    this.queue = new QueueCollection();

    // create plugins collection
    this.plugins = new PluginsCollection([

      // add default plugins
      require('grabbix-mangaeden')
      // TODO andrea's plugin here

    ]);

    // fetch cached plugins
    this.plugins.fetch({ remove: false });

    // get header channel
    var headerChannel = Radio.channel('header');

    // render search view when title change
    headerChannel.on('change:title', this.showSearch, this);

  },


  /**
   * Start the app by showing the appropriate views
   */

  start: function () {

    // init base components
    this.showHeader();
    this.showFooter();

    // render home
    this.showHome();

  },


  /**
   * render header to its region
   */

  showHeader: function() {

    // get view's constructor
    var HeaderView = require('../views/header');

    // create view instance
    var header = new HeaderView();

    // render view to right region
    app.root.showChildView('header', header);

  },


  /**
   * render footer to its region
   */

  showFooter: function() {

    // placeholder

  },


  /**
   * render home view
   */

  showHome: function() {

    // get view's constructor
    var HomeView = require('../views/home');

    // create view instance
    var home = new HomeView();

    // render view to right region
    app.root.showChildView('main', home);

  },


  /**
   * show comics search page
   *
   * @param {String} [title]
   */

  showSearch: function(title) {

    // update url
    this.router.navigate('search');

    // get view's constructor
    var SearchView = require('../views/search');

    // get current rendered view
    var currentView = app.root.main.currentView;

    // check if already rendered
    if (currentView instanceof SearchView) {

      // search requested title
      if (title) currentView.model.set('title', title);

      // prevent view re-creation
      return;

    }

    // create view instance
    var search = new SearchView({
      plugins: this.plugins,
      title: title
    });

    // render view to right region
    app.root.showChildView('main', search);

  },


  /**
   * render plugins view
   */

  showPlugins: function() {

    // get view's constructor
    var PluginsView = require('../views/plugins');

    // create view instance
    var plugins = new PluginsView({
      collection: this.plugins
    });

    // render view to right region
    app.root.showChildView('main', plugins);

  },


  /**
   * render comic view
   */

  showComic: function(pluginID, comicID) {

    // get plugin instance
    var plugin = this.plugins.findWhere({ id: pluginID });

    // get comic instance
    var comic = plugin.comics.findWhere({ id: comicID });

    // get view's constructor
    var ComicView = require('../views/comic');

    // create view instance
    var view = new ComicView({
      plugin: plugin,
      comic: comic
    });

    // render view to right region
    app.root.showChildView('main', view);

  },


  /**
   * render chapter reader view
   */

  showChapter: function(pluginID, comicID, chapterID) {

    // get plugin instance
    var plugin = this.plugins.findWhere({ id: pluginID });

    // get comic instance
    var comic = plugin.comics.findWhere({ id: comicID });

    // get target chapter
    var chapter = comic.chapters.findWhere({ id: chapterID });

    // get view's constructor
    var ChapterBookView = require('../views/chapter-book');

    // create view instance
    var view = new ChapterBookView({
      model: chapter,
      collection: chapter.pages
    });

    // render view to right region
    app.root.showChildView('main', view);

  },


  /**
   * show favorite comics view
   */

  showFavorites: function() {

    // placeholder

  },


  /**
   * show download queue view
   */

  showQueue: function() {

    // get view's constructor
    var QueueView = require('../views/queue');

    // create view instance
    var view = new QueueView({
      collection: this.queue
    });

    // render view to right region
    app.root.showChildView('main', view);

  }


});


/**
 * exports
 */

module.exports = Mediator;
