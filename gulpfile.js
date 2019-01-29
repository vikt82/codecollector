"use strict";

var gulp = require('gulp');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

var paths = {
  styles: {
    src: 'src/scss/style.css',
    watch: ['src/scss/**/*.css'],
    dest: 'dist/assets/css'
  }
  // scripts: {
  //   src: 'src/scripts/**/*.js',
  //   dest: 'assets/scripts/'
  // }
};

gulp.task('styles', function() {
  var plugins = [
      autoprefixer({browsers: "last 5 versions"}),
      cssnano()
    ];

  return gulp.src(paths.styles.src)
    .pipe( sourcemaps.init() )
    .pipe(postcss( plugins ))
    .pipe( sourcemaps.write('.') )
    .pipe(gulp.dest(paths.styles.dest));
});

gulp.watch(paths.styles.src, gulp.series('styles'));

gulp.task('dev', gulp.series('styles'));