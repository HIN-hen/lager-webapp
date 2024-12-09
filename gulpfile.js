import gulp from "gulp";
import uglify from "gulp-uglify"; // minify js files
import cleanCSS from "gulp-clean-css"; // minify css files

// Task to minify JavaScript
gulp.task('minify-js', () => {
  return gulp.src('public/**/*.js', { sourcemaps: true })
    .pipe(uglify())  // Minify the JavaScript
    .pipe(gulp.dest('dist/js'));  // Output to dist/js
});

// Task to minify CSS
gulp.task('minify-css', () => {
  return gulp.src(
    'public/css/*.css')  // Adjust this path based on your project structure
    .pipe(cleanCSS())  // Minify the CSS
    .pipe(gulp.dest('dist/css'));  // Output to dist/css
});

// Default task to run both minification tasks
gulp.task('default', gulp.parallel('minify-js', 'minify-css'));
