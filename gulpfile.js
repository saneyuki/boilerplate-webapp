/*
 * @license MIT License
 *
 * Copyright (c) 2014 Tetsuharu OHZEKI <saneyuki.snyk@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserify = require('browserify');
var reactify = require('reactify');
var espowerify = require('espowerify');
var source = require('vinyl-source-stream');
var exorcist = require('exorcist'); // Split sourcemap into the file.

var argv = require('yargs').argv;

var isRelease = argv.release

var SRC_JS = './script/main.js';
var SRC_CSS = './style/main.scss';
var DIST_BUILD_DIR = './build/';
var DIST_JS_MAP_FILE = DIST_BUILD_DIR + 'main.js.map';

var SRC_TEST_MANIFEST = './test/manifest.js';
var DIST_TEST_DIR = './powered-test/';


gulp.task('css', function() {
    var option = {
        errLogToConsole: true,
        // sourcemap
        sourceComments: isRelease ? 'none' : 'map',
        // `expanded` are not supported currently by libsass
        outputStyle: 'expanded',
    };

    gulp.src(SRC_CSS)
        .pipe(sass(option))
        .pipe(gulp.dest(DIST_BUILD_DIR));
});

gulp.task('js', function() {
    var option = {
        insertGlobals: false,
        debug: isRelease ? false : true,
    };

    browserify(SRC_JS, option)
        .transform(reactify)
        .bundle()
        .pipe(exorcist(DIST_JS_MAP_FILE))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(DIST_BUILD_DIR));
});

gulp.task('espower', function() {
    var option = {
        insertGlobals : false,
        debug : true,
    };

    browserify(SRC_TEST_MANIFEST, option)
        .transform(espowerify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(DIST_TEST_DIR));
});

gulp.task('jstest', ['espower'], function() {});
gulp.task('build', ['css', 'js'], function() {});
