var gulp = require('gulp');

var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var stylus = require('gulp-stylus');
var vulcanize = require('gulp-vulcanize');

var paths = {
    js: 'src/**/*.js',
    html: 'src/**/*.html',
    css: 'src/**/*.styl',
};

// clean
gulp.task('clean', function() {
    return gulp.src('bin/**/*', {read: false})
    .pipe(clean())
    ;
});

// js
gulp.task('js', function() {
    return gulp.src(paths.js, {base: 'src'})
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(uglify())
    .pipe(gulp.dest('bin'))
    ;
});

// css
gulp.task('css', function() {
    return gulp.src(paths.css)
    .pipe(stylus({
        compress: true,
        include: 'src'
    }))
    .pipe(gulp.dest('bin'))
    ;
});

// html
gulp.task('copy-html', function() {
    return gulp.src(paths.html, {base: 'src'} )
    .pipe(gulp.dest('bin'))
    ;
});

// build html
gulp.task('build-html', ['js', 'css', 'copy-html'], function() {
    return gulp.src('bin/all.html')
    .pipe(vulcanize({
        dest: 'bin',
        inline: true,
    }))
    .pipe(gulp.dest('bin'))
    ;
});

// watch
gulp.task('watch', function() {
    gulp.watch(paths.js, ['js']);
    gulp.watch(paths.css, ['css', 'build-html']);
    gulp.watch(paths.html, ['copy-html', 'build-html']);
});

// tasks
gulp.task('default', ['js', 'css', 'copy-html', 'build-html'] );
