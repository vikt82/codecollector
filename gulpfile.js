"use strict";

var gulp = require('gulp');

var browserSync = require('browser-sync').create();

var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
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

var fs = require('fs');
var data = require('gulp-data');
var plumber = require('gulp-plumber');

var pug = require('gulp-pug');


sass.compiler = require('node-sass');

var paths = {
  styles: {
    src: ['src/scss/**/*.scss', 'src/scss/**/*.sass'],
    watch: ['src/scss/**/*.scss', 'src/scss/**/*.sass'],
    dest: 'dist/assets/css'
  },
  templates: {
    src: 'src/templates/**/*.pug',
    dest: 'dist/'
  }
  // scripts: {
  //   src: 'src/scripts/**/*.js',
  //   dest: 'assets/scripts/'
  // }
};

// Static Server + watching scss/html files
gulp.task('serve', function() {

  browserSync.init({
      server: "./dist",
      open: false
  });

  // gulp.watch("app/scss/*.scss", ['sass']);
  gulp.watch("dist/**/*.*").on('change', browserSync.reload);
});

gulp.task('styles', function() {
  var plugins = [
      autoprefixer({browsers: "last 5 versions"}),
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
      rucksack({
        fallbacks: true,
        autoprefixer: false
      }),
      lost(),
      // cssnext(),
      mqpacker(),
      zindex(),
      cssnano()
    ];

  return gulp.src(paths.styles.src)
    .pipe(plumber())
    .pipe( sourcemaps.init() )
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(postcss( plugins ))
    .pipe( sourcemaps.write('.') )
    .pipe(gulp.dest(paths.styles.dest));
});



gulp.task('templates', function() {
  return gulp.src(paths.templates.src)
    .pipe(plumber())

    .pipe(data(function() {
      return JSON.parse(fs.readFileSync('./src/templates/data/data.json'));
    }))
    
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(paths.templates.dest));
});

gulp.watch(paths.styles.src, gulp.series('styles'));
gulp.watch(paths.templates.src, gulp.series('templates'));

gulp.task('dev', gulp.series('serve', 'styles', 'templates'));