'use strict';

// Requires
var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    del = require('del'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;



// Lint JavaScript
gulp.task('lint', function () {
  return gulp.src('app/js/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});


// Optimize images
gulp.task('images', function() {
  gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'));
});


// Compile jade 
gulp.task('views', function() {
  return gulp.src('app/*.jade')
    .pipe($.jade({pretty: true}))
    .pipe(gulp.dest('.tmp'));
})


// Compile and automatically prefix stylesheets
gulp.task('styles', function () {
  const AUTOPREFIXER_BROWSERS = [
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
    .pipe($.sass({
      precision: 10
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('.tmp/css'))
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

// Clean output directory
gulp.task('clean', del.bind(null, ['.tmp', 'dist/*', '!dist/.git'], {dot: true}));


// Copy all files at the root level (app)
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
gulp.task('fonts', function () {
  return gulp.src(['app/fonts/**'])
    .pipe(gulp.dest('dist/fonts'));
});

// Watch files for changes & reload
gulp.task('serve', ['views', 'styles'], function () {
  browserSync({
    notify: false,
    logPrefix: 'WSK',
    server: ['.tmp', 'app']
  });

  gulp.watch(['app/**/*.jade'], ['views', reload]);
  gulp.watch(['app/**/*.html'], reload);
  gulp.watch(['app/sass/**/*.{sass,scss,css}'], ['styles', reload]);
  gulp.watch(['app/js/**/*.js'], ['lint']);
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
  runSequence('styles', ['lint', 'html', 'images', 'fonts', 'copy'], cb);
});

