'use strict';

// Requires
var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    del = require('del'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    beep = require('beepbeep'),
    reload = browserSync.reload;



// Optimize images
gulp.task('images', function() {
  gulp.src('app/images/**/*')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [
          {removeViewBox: false},
          {cleanupIDs: false}
      ],
    }))
    .pipe(gulp.dest('dist/images'));
});



// Compile jade
gulp.task('views', function() {
  return gulp.src('app/*.jade')
    .pipe($.plumber(function() {
      beep();
      this.emit('end');
    }))
    .pipe($.jade({pretty: true})).on('error', function(err) {
      console.log(err);
    })
    .pipe(gulp.dest('.tmp'));
});



// Compile and automatically prefix stylesheets
gulp.task('styles', function() {
  var AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  return gulp.src([
    'app/sass/**/*.sass',
    'app/sass/**/*.scss',
    'app/sass/**/*.css'
  ])
    .pipe($.newer('.tmp/css'))
    .pipe($.sourcemaps.init())
    .pipe($.plumber(function() {
      beep();
    }))
    .pipe($.sass({
      precision: 10
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('.tmp/css'));
});



// Scan the HTML for assets and optimize them
gulp.task('html', ['views'], function() {
  return gulp.src(['app/*.html', '.tmp/*.html'])
    .pipe($.useref({searchPath: ['.tmp', 'app']}))
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.if('*.js', $.uglify({preserveComments: 'some'})))
    .pipe($.if('*.html', $.htmlmin({
      collapseWhitespace: true,
      removeEmptyAttributes: true,
      preserveLineBreaks: false
    })))
    .pipe(gulp.dest('dist'));
});



// Clean dist and .tmp directories
gulp.task('clean', function() {
  return del.bind(null, ['.tmp/*', 'dist/*', '!dist/.git'], {dot: true});
});



// Copy files at the root level to dist
gulp.task('copy', function () {
  return gulp.src([
    'app/*',
    '!app/sass',
    '!app/bower_components',
    '!app/jade',
    '!app/*.jade',
    '!app/*.html',
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});



// Copy web fonts to dist
gulp.task('fonts', function() {
  return gulp.src(['app/fonts/**'])
    .pipe(gulp.dest('dist/fonts'));
});



//Copy data to dist
gulp.task('data', function() {
  return gulp.src(['app/data/**'])
    .pipe(gulp.dest('dist/data'));
});



// Copy bower items to dist
gulp.task('bower', function() {
  return gulp.src(['app/bower_components/**'])
    .pipe(gulp.dest('dist/bower_components'));
});



// Watch files for changes & reload
gulp.task('serve', ['clean'], function() {
  runSequence('views', 'styles');
  browserSync({
    notify: false,
    logPrefix: 'WSK',
    server: ['.tmp', 'app']
  });

  gulp.watch(['app/**/*.jade'], ['views', reload]);
  gulp.watch(['app/**/*.html'], reload);
  gulp.watch(['app/sass/**/*.{sass,scss,css}'], ['styles', reload]);
  gulp.watch(['app/js/**/*.js'], reload);
  gulp.watch(['app/images/**/*'], reload);
});



// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function () {
  browserSync({
    notify: false,
    logPrefix: 'WSK',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: 'dist'
  });
});



// Default task - Build production files
gulp.task('default', ['clean'], function (cb) {
  runSequence('styles', ['html', 'images', 'fonts', 'copy', 'data', 'bower'], cb);
});