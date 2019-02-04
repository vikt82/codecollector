"use strict";
// GULP
var gulp = require('gulp');
// STATIC SERVER
var browserSync = require('browser-sync').create();
// POSTCSS
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
//LINT
var plumber = require('gulp-plumber');
//PUG
var fs = require('fs');
var data = require('gulp-data');
var pug = require('gulp-pug');


sass.compiler = require('node-sass');

// PATH'S
var paths_dev = {
  styles: {
    src: ['src/scss/**/*.scss', 'src/scss/**/*.sass'],
    watch: ['src/scss/**/*.scss', 'src/scss/**/*.sass'],
    dest: 'dist/assets/css'
  },
  templates: {
    src: 'src/templates/**/*.pug',
    dest: 'dist/'
  },
  assets: {
    src: 'src/img/**/*.*',
    dest: 'dist/assets/images/'
  }
};
var paths_build = {
  styles: {
    src: ['src/scss/**/*.scss', 'src/scss/**/*.sass'],
    watch: ['src/scss/**/*.scss', 'src/scss/**/*.sass'],
    dest: 'app/assets/css'
  },
  templates: {
    src: 'app/templates/**/*.pug',
    dest: 'dist/'
  },
  assets: {
    src: 'app/img/**/*.*',
    dest: 'dist/assets/images/'
  }
};

// Static Server + watching html files
gulp.task('serve', function() {

  browserSync.init({
      server: "./dist",
      open: false
  });

  // gulp.watch("app/scss/*.scss", ['sass']);
  gulp.watch("dist/**/*.*").on('change', browserSync.reload);
});

// STYLES: sass, postcss
gulp.task('styles:dev', function() {
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
      // cssnano()
    ];

  return gulp.src(paths_dev.styles.src)
    .pipe(plumber())
    .pipe( sourcemaps.init() )
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(postcss( plugins ))
    .pipe( sourcemaps.write('.') )
    .pipe(gulp.dest(paths_dev.styles.dest));
});

// TEMPLATES: pug
gulp.task('templates:dev', function() {
  return gulp.src(paths_dev.templates.src)
    .pipe(plumber())

    .pipe(data(function() {
      return JSON.parse(fs.readFileSync('./src/templates/data/data.json'));
    }))
    
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(paths_dev.templates.dest));
});

// ASSETS
gulp.task('assets:dev', function() {
  return gulp.src(paths_dev.assets.src)
    .pipe(plumber())
    .pipe(gulp.dest(paths_dev.assets.dest));
});

gulp.watch(paths_dev.styles.src, gulp.series('styles:dev'));
gulp.watch(paths_dev.templates.src, gulp.series('templates:dev'));
gulp.watch(paths_dev.assets.src, gulp.series('assets:dev'));

gulp.task('dev', gulp.series('serve', ['assets:dev', 'styles:dev', 'templates:dev']));
