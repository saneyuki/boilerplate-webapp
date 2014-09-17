/* vim: set filetype=javascript shiftwidth=4 tabstop=4 expandtab: */
"use strict";

var gulp = require("gulp");
var browserify = require("browserify");
var espowerify = require("espowerify");
var transform = require("vinyl-transform");

var SRC_JS = "script/main.js";
var SRC_CSS = "style/**.css";
var DIST_BUILD_DIR = "build/";

var SRC_TEST = "test/manifest.js";
var DIST_TEST_DIR = "powered-test/";

gulp.task("css", function() {
  gulp.src(SRC_CSS)
      .pipe(gulp.dest(DIST_BUILD_DIR));
});

gulp.task("js", function() {
    var option = {
        insertGlobals : false,
        debug : true,
        standalone: false,
    };

    var browserifier = transform(function(filename){
        var b = browserify(option).add(filename)
        return b.bundle();
    });

    gulp.src(SRC_JS)
        .pipe(browserifier)
        .pipe(gulp.dest(DIST_BUILD_DIR));
});

gulp.task("espower", function() {
    var option = {
        insertGlobals : false,
        debug : true,
        standalone: false,
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

gulp.task("jstest", ["espower"], function() {});
gulp.task("build", ["css", "js"], function() {});