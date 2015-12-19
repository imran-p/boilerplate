// Dependencies
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    autoprefixer = require('gulp-autoprefixer'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync');

// Tasks
gulp.task('styles', function() {
  return gulp.src('scss/global.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('css/'))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('css/'))
});

gulp.task('jshint', function() {
    return gulp.src('js/main/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
});

gulp.task('scripts', function() {
  return gulp.src(['js/libs/*.js', 'js/main/*.js'])
    .pipe(concat('global.js'))
    .pipe(gulp.dest('js/dist/'))
    .pipe(rename('global.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js/dist/'));
});

gulp.task('browser-sync', function() {
    browserSync.init(['css/global.css','js/dist/global.js'], {
        server: {
            baseDir: './'
        }
    });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('watch', function() {
    gulp.watch('scss/*.scss', ['styles']);
    gulp.watch('js/main/*.js', ['jshint', 'scripts']);
    gulp.watch(['*.html'], ['bs-reload']);
});

// Default task
gulp.task('default', ['styles', 'jshint', 'scripts', 'browser-sync', 'watch']);