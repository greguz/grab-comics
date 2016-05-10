/**
 * dependencies
 */

var gulp          = require('gulp')
  , less          = require('gulp-less') // https://github.com/plus3network/gulp-less
  , handlebars    = require('gulp-handlebars') // https://github.com/lazd/gulp-handlebars
  , defineModule  = require('gulp-define-module') // https://github.com/wbyoung/gulp-define-module
  , imagemin      = require('gulp-imagemin'); // https://github.com/sindresorhus/gulp-imagemin


/**
 * global vars
 */

var bower = 'source/components/';


/**
 * LESS compilation
 */

gulp.task('less', function() {

  gulp.src('./source/styles/bootstrap.less')
    .pipe(less())
    .pipe(gulp.dest('./assets/css'))
  ;

});


/**
 * (handlebars) templates pre-compilation
 */

gulp.task('handlebars', function() {

  gulp.src('source/templates/*.hbs')
    .pipe(handlebars({ handlebars: require('handlebars') }))
    .pipe(defineModule('node'))
    .pipe(gulp.dest('templates'))
  ;

});


/**
 * copy dependencies
 */

gulp.task('copy', function() {

  var js = [
    'bootstrap/dist/js/bootstrap.js',
    'bootstrap-multiselect/dist/js/bootstrap-multiselect.js',
    'remarkable-bootstrap-notify/dist/bootstrap-notify.js',
    'bootstrap-switch/dist/js/bootstrap-switch.js',
    'justifiedGallery/dist/js/jquery.justifiedGallery.js'
  ];

  var css = [
    'flag-icon-css/css/flag-icon.css',
    'fontawesome/css/font-awesome.css',
    'justifiedGallery/dist/css/justifiedGallery.css'
  ];

  js.forEach(function(glob) {

    gulp.src(bower + glob)
      .pipe(gulp.dest('assets/js'))
    ;

  });

  css.forEach(function(glob) {

    gulp.src(bower + glob)
      .pipe(gulp.dest('assets/css'))
    ;

  });

  gulp.src(bower + 'fontawesome/fonts/**/*')
    .pipe(gulp.dest('assets/fonts'))
  ;

  gulp.src(bower + 'flag-icon-css/flags/**/*')
    .pipe(gulp.dest('assets/flags'))
  ;

});


/**
 * images optimization
 */

gulp.task('images', function() {

  gulp.src('source/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('assets/img'))
  ;

});


/**
 * default task
 */

gulp.task('default', [ 'less', 'handlebars', 'copy', 'images' ]);
