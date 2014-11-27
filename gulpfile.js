/* vim: set filetype=javascript shiftwidth=4 tabstop=4 expandtab: */
'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('browserify');
var espowerify = require('espowerify');
var transform = require('vinyl-transform');
var exorcist = require('exorcist'); // Split sourcemap into the file.

var argv = require('yargs').argv;

var isRelease = argv.release

var SRC_JS = './script/main.js';
var SRC_CSS = './style/main.scss';
var DIST_BUILD_DIR = './build/';
var DIST_JS_MAP_FILE = DIST_BUILD_DIR + 'main.js.map';
var DIST_CSS_MAP_FILE = DIST_BUILD_DIR + 'main.scss.map';

var SRC_TEST = './test/manifest.js';
var DIST_TEST_DIR = './powered-test/';


gulp.task('css', function() {
    var option = {
        errLogToConsole: true,
        // sourcemap
        sourceComments: isRelease ? 'none' : 'map',
        // `expanded` are not supported currently by libsass
        outputStyle: 'expanded',
    };

    var exorcister = transform(function(){
        return exorcist(DIST_CSS_MAP_FILE);
    });

    gulp.src(SRC_CSS)
        .pipe(sass(option))
        .pipe(exorcister)
        .pipe(gulp.dest(DIST_BUILD_DIR));
});

gulp.task('js', function() {
    var option = {
        insertGlobals: false,
        debug: isRelease ? false : true,
    };

    var browserifier = transform(function(filename){
        var b = browserify(option).add(filename)
        return b.bundle();
    });

    var exorcister = transform(function(){
        return exorcist(DIST_JS_MAP_FILE);
    });

    gulp.src(SRC_JS)
        .pipe(browserifier)
        .pipe(exorcister)
        .pipe(gulp.dest(DIST_BUILD_DIR));
});

gulp.task('espower', function() {
    var option = {
        insertGlobals : false,
        debug : true,
    };

    var browserifier = transform(function(filename){
        var b = browserify(option).add(filename)
                                  .transform(espowerify);
        return b.bundle();
    });

    gulp.src(SRC_TEST)
        .pipe(browserifier)
        .pipe(gulp.dest(DIST_TEST_DIR));
});

gulp.task('jstest', ['espower'], function() {});
gulp.task('build', ['css', 'js'], function() {});
