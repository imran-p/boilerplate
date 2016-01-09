// Dependencies
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    autoprefixer = require('gulp-autoprefixer'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync'),
    browserify = require('browserify'),
    notify = require("gulp-notify");

// Tasks
gulp.task('styles', function() {
  return gulp.src('scss/global.scss')
    .pipe(sass().on('error', reportError))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('css/'))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('css/'))
});

// Sass error reporting
var reportError = function (error) {
    notify({
        title: 'Gulp Task Error',
        message: 'Check the console.'
    }).write(error);

    console.log(error.toString());

    this.emit('end');
}

// JS error reporting
gulp.task('jshint', function() {
    return gulp.src('js/main/*.js')
        .pipe(jshint())
        // Use gulp-notify as jshint reporter
        .pipe(notify(function(file) {
            if (file.jshint.success) {
                // Don't show something if success
                return false;
            }

            var errors = file.jshint.results.map(function(data) {
                if (data.error) {
                    return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
                }
            }).join("\n");
            return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
        }));
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