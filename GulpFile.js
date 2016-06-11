/**
 * Created by tykayn on 14/05/15.
 */
var gulp          = require("gulp"),
    gutil         = require("gulp-util"),
    plumber       = require("gulp-plumber"),
    myth          = require("gulp-myth"),
    csso          = require("gulp-csso"),
    coffee        = require("gulp-coffee"),
    options       = require("minimist")(process.argv.slice(2)),
    sass          = require('gulp-sass'),
    browserSync   = require('browser-sync'),
    reload        = browserSync.reload,
    karma         = require('karma').server,
    documentation = require('documentation');
var wiredep = require('wiredep').stream;
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var testFiles = [
  'dist/js/main.js'
];

var sources = {
  tests    : "src/tests/*.js",
  sass     : "src/sass/*.scss",
  html     : "src/html/*.html",
  htmls    : "src/html/**/*.html",
  distIndex: "dist/index.html",
  js       : "src/scripts/*.js",
  jsAll    : "src/scripts/**/*.js",
  coffee   : "src/coffee/*.coffee"
};
var destinations = {
  sass  : "dist/css/",
  html  : "dist/",
  coffee: "dist/coffee/",
  js    : "dist/js/",
  doc   : "dist/doc/"
};

var imageminJpegoptim = require('imagemin-jpegoptim');

gulp.task('imagemin', function () {
  return gulp.src('images/*.jpg')
    .pipe(imageminJpegoptim({progressive: true})())
    .pipe(gulp.dest('dist/images'));
});

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun : true
  }, done);
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, done);
});

gulp.task("styles", function () {
  gulp.src("./src/css/*.css")
    .pipe(options.production ? plumber() : gutil.noop())
    .pipe(myth({sourcemap: !options.production}))
    .pipe(options.production ? csso() : gutil.noop())
    .pipe(gulp.dest("./dist/css/"));
});
gulp.task("hello", function () {
  console.log("hello le monde!");
});
gulp.task('browser-sync', function () {
  return browserSync.init(null, {
    open  : true,
    server: {
      baseDir: "./dist"
    }
  });
});
gulp.task("sass2css", function () {
  console.log("style was changed");
  gulp.src("./src/sass/*.scss")
    .pipe(sass({outputStyle: 'compressed', errLogToConsole: true}))
    .pipe(gulp.dest("./dist/css/"))
    .pipe(browserSync.stream());
});
gulp.task("coffee2js", function () {
  console.log("coffee was changed");
  gulp.src("./src/coffee/**/*.coffee")
    .pipe(coffee())
    .pipe(plumber())
    .pipe(gulp.dest("./dist/js/"))
    .pipe(uglify())
    .pipe(browserSync.stream());
  console.log("coffee was served");
});
gulp.task('watch', function () {
  gulp.watch('GulpFile.js', ['default']);
  gulp.watch(sources.tests, ['test']);
  gulp.watch(sources.sass, ['sass2css']);
  gulp.watch('bower.json', ['wiredep']);
  gulp.watch(sources.html, ['html_transform']);
//  gulp.watch(sources.htmls, ['html','wiredep']);
  gulp.watch(sources.coffee, ['coffee2js', 'test']);

});
gulp.task('lint', function () {
  gulp.src(sources.js)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});


gulp.task("html_transform", function () {
  console.log("html was changed");
  gulp.src([sources.htmls, sources.html])
    .pipe(gulp.dest(destinations.html))
    .pipe(browserSync.stream());
  console.log("html regenerated");
});

// link dependencies only on the main index
gulp.task('wiredep', ['html_transform'], function () {
  console.log("wire dependencies from distant index");
  gulp.src(sources.distIndex)
    .pipe(wiredep({
      directory: 'dist/bower_components'
    }))
    .pipe(gulp.dest(destinations.html))
  ;
});
gulp.task("default", [ "wiredep","coffee2js", "sass2css", "lint", "browser-sync", "imagemin", "watch"], function () {
  console.log("spartiiiii");
});
