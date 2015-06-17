/**
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
/**
 *  # The rules of task name
 *
 *  ## public task
 *  - This is completed in itself.
 *  - This is callable as `gulp <taskname>`.
 *
 *  ## private task
 *  - This has some sideeffect in dependent task trees
 *    and it cannot recovery by self.
 *  - This is __callable only from public task__.
 *    DONT CALL as `gulp <taskname>`.
 *  - MUST name `__taskname`.
 */
'use strict';

const babelify = require('babelify');
const browserify = require('browserify');
const childProcess = require('child_process');
const espowerify = require('espowerify');
const exorcist = require('exorcist'); // Split sourcemap into the file.
const gulp = require('gulp');
const path = require('path');
const sass = require('gulp-sass');
const source = require('vinyl-source-stream');

const isRelease = process.env.NODE_ENV === 'production';

const NODE_BIN = 'iojs';
const NPM_MOD_DIR = path.resolve(__dirname, './node_modules/');

const SRC_JS = './script/main.js';
const SRC_CSS = './style/main.scss';
const DIST_BUILD_DIR = './build/';
const DIST_JS_MAP_FILE = DIST_BUILD_DIR + 'main.js.map';

const SRC_TEST_MANIFEST = './test/manifest.js';
const DIST_TEST_DIR = './powered-test/';

gulp.task('css', function() {
    const option = {
        errLogToConsole: true,
        // sourcemap
        sourceComments: isRelease ? 'none' : 'map',
        // `expanded` are not supported currently by libsass
        outputStyle: 'expanded',
    };

    return gulp.src(SRC_CSS)
        .pipe(sass(option))
        .pipe(gulp.dest(DIST_BUILD_DIR));
});

gulp.task('jslint', function(callback){
    const src = [
        './gulpfile.js',
        './launch_test.js',
        './script/',
        './test/',
        './test_mock/',
    ];

    const bin = path.resolve(NPM_MOD_DIR, './eslint', './bin', './eslint.js');

    const args = [
        bin,
        '--ext', '.js',
    ].concat(src);

    const option = {
        cwd: path.relative(__dirname, ''),
        stdio: 'inherit',
    };

    const eslint = childProcess.spawn(NODE_BIN, args, option);
    eslint.on('exit', callback);
});

gulp.task('js', ['jslint'], function() {
    const option = {
        insertGlobals: false,
        debug: !isRelease,
    };

    const babel = babelify.configure({
        optional: [
            'utility.inlineEnvironmentVariables',
        ],
    });

    return browserify(SRC_JS, option)
        .transform(babel)
        .bundle()
        .pipe(exorcist(DIST_JS_MAP_FILE))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(DIST_BUILD_DIR));
});

gulp.task('espower', function() {
    const option = {
        insertGlobals: false,
        debug: true,
    };

    return browserify(option)
        .add(SRC_TEST_MANIFEST)
        .transform(espowerify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(DIST_TEST_DIR));
});

gulp.task('jstest', ['espower', 'jslint'], function() {});
gulp.task('build', ['css', 'js'], function() {});
