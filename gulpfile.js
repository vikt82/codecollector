"use strict";

var gulp = require('gulp');
var postcss = require('gulp-postcss');

var paths = {
  styles: {
    src: 'src/scss/**/*.css',
    dest: 'dist/assets/css'
  }
  // scripts: {
  //   src: 'src/scripts/**/*.js',
  //   dest: 'assets/scripts/'
  // }
};

gulp.task('style', function() {
  var proccessors = [
    
  ];

  return gulp.src(paths.styles.src)
    .pipe(postcss( proccessors))
    .pipe(gulp.dest(paths.styles.dest));
});


// gulp.task('default', function() {
//   gulp.watch(paths.styles.src, ['style']);
// });

// function watch() {
//   gulp.watch(paths.styles.src, style);
// }

// gulp.task('default', ['watch']);