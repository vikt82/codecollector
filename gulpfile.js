"use strict";

// GULP
const gulp = require('gulp');
const plumber = require('gulp-plumber');

//SOURCEMAPS
const sourcemaps = require('gulp-sourcemaps');

// STYLE
const sass = require('gulp-sass');
sass.compiler = require('node-sass');

// POSTCSS
const postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var mqpacker = require("css-mqpacker");
// var cssnext = require("postcss-cssnext");
var rucksack = require('rucksack-css');
var lost = require('lost');
var pxtorem = require('postcss-pxtorem');
var pr = require('postcss-pr');
var postcssNormalize = require('postcss-normalize');
var zindex = require('postcss-zindex');

// DELETE DEST
const del = require('del');

// PUG
const pug = require('gulp-pug');
const data = require('gulp-data');
const fs = require('fs');

// START:PATHS
var libsPath = {
  libs: './node_modules/'
}
var pathsDev = {
  style: {
    src: './src/scss/**/*.{scss,sass}',
    dest: './dest/assets/css/'
  },
  assets: {
    src: './src/img/**/*.{jpg,png,jpeg}',
    dest: './dest/assets/image/'
  },
  templates: {
    src: './src/templates/**/*.pug',
    dest: './dest/'
  }
}
// END:PATHS

// START:STYLE
gulp.task('style:dev', function () {
  var plugins = [
    postcssNormalize({
      browserslist: "last 5 versions",
      allowDuplicates: false,
      browsers: 'last 5 versions',
      forceImport: true
    }),
    pxtorem({
      rootValue: 16,
      unitPrecision: 5,
      propList: ['font', 'font-size', 'line-height', 'letter-spacing'],
      selectorBlackList: [],
      replace: true,
      mediaQuery: false,
      minPixelValue: 0
    }),
    pr(),
    lost(),
    mqpacker(),
    zindex(),
    cssnano(),
    rucksack({
      fallbacks: true,
      autoprefixer: false
    }),
    autoprefixer({
      browsers: "last 5 versions"
    })
    // cssnext(),
  ];
  return gulp.src(pathsDev.style.src)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(pathsDev.style.dest));
});
// END:STYLE

// START:PUG
gulp.task('pug', function () {
  return gulp.src(pathsDev.templates.src)
    .pipe(plumber())
    .pipe(data(function () {
      return JSON.parse(fs.readFileSync('./src/templates/data/data.json'));
    }))
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(pathsDev.templates.dest))
});
// END:PUG

// START:ASSETS
gulp.task('assets:dev', function () {
  return gulp.src(pathsDev.assets.src)
    .pipe(plumber())
    .pipe(gulp.dest(pathsDev.assets.dest))
});
// END:ASSETS

// START:DEL
gulp.task('clean', function () {
  return del('dest/');
});
// END:DEL

// START:GULP:TASK
gulp.task('dev', gulp.series(
  'clean',
  gulp.parallel('style:dev', 'pug', 'assets:dev')));
// END:GULP:TASK