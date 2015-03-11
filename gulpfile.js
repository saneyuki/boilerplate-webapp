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

let babelify = require('babelify');
let browserify = require('browserify');
let eslint = require('gulp-eslint');
let espowerify = require('espowerify');
let exorcist = require('exorcist'); // Split sourcemap into the file.
let gulp = require('gulp');
let sass = require('gulp-sass');
let source = require('vinyl-source-stream');

const isRelease = process.env.NODE_ENV === 'production';

const SRC_JS = './script/main.js';
const SRC_CSS = './style/main.scss';
const DIST_BUILD_DIR = './build/';
const DIST_JS_MAP_FILE = DIST_BUILD_DIR + 'main.js.map';

const SRC_TEST_MANIFEST = './test/manifest.js';
const DIST_TEST_DIR = './powered-test/';

gulp.task('css', function() {
    let option = {
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

gulp.task('jslint', function(){
    let option = {
        useEslintrc: true,
    };

    return gulp.src([
        './gulpfile.js',
        './launch_test.js',
        './script/**/*.js',
        './test/**/*.js',
        './test_mock/**/*.js'])
        .pipe(eslint(option))
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('js', ['jslint'], function() {
    let option = {
        insertGlobals: false,
        debug: !isRelease,
    };

    let babel = babelify.configure({
        optional: [
            'utility.inlineEnvironmentVariables',
        ],
    });

    browserify(SRC_JS, option)
        .transform(babel)
        .bundle()
        .pipe(exorcist(DIST_JS_MAP_FILE))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(DIST_BUILD_DIR));
});

gulp.task('espower', function() {
    let option = {
        insertGlobals: false,
        debug: true,
    };

    browserify(option)
        .add(SRC_TEST_MANIFEST)
        .transform(espowerify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(DIST_TEST_DIR));
});

gulp.task('jstest', ['espower', 'jslint'], function() {});
gulp.task('build', ['css', 'js'], function() {});
