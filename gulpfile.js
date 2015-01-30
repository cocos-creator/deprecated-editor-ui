var gulp = require('gulp');

var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var compiler = require('gulp-closure-compiler');
var tap = require('gulp-tap');
var stylus = require('gulp-stylus');
var vulcanize = require('gulp-vulcanize');
var del = require('del');
var es = require('event-stream');
var path = require('path');

function wrapScope () {
    var header = new Buffer("(function () {\n");
    var footer = new Buffer("})();\n");
    return es.through(function (file) {
        // do not wrap scope on first classes
        if ( path.dirname(file.relative) === "." ) {
            this.emit('data', file);
            return;
        }

        file.contents = Buffer.concat([header, file.contents, footer]);
        this.emit('data', file);
    });
}

var paths = {
    ext_core: '../core/bin/**/*.js',

    js: 'src/**/*.js',
    html: 'src/**/*.html',
    css: 'src/**/*.styl',
    img: 'src/img/**/*',
};

// clean
gulp.task('clean', function() {
    del('bin/');
});

// copy
gulp.task('cp-core', function() {
    return gulp.src(paths.ext_core)
    .pipe(gulp.dest('ext/fire-core'))
    ;
});
gulp.task('cp-img', function() {
    return gulp.src(paths.img)
    .pipe(gulp.dest('bin/img'))
    ;
});
gulp.task('cp-html', function() {
    return gulp.src(paths.html, {base: 'src'} )
    .pipe(gulp.dest('bin'))
    ;
});

// js
gulp.task('js', function() {
    return gulp.src(paths.js, {base: 'src'})
    .pipe(wrapScope())
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(tap(function (file) {
        var filename = file.path;
        var globname = path.relative(__dirname, filename);
        return gulp.src(globname)
                    .pipe(compiler({
                        compilerPath: path.normalize('../../compiler/compiler.jar'),
                        compilerFlags: {
                            language_in: 'ECMASCRIPT6',
                            language_out: 'ECMASCRIPT5',
                            compilation_level: 'ADVANCED_OPTIMIZATIONS',
                            jscomp_off: 'globalThis',
                        },
                        fileName: path.relative(path.join(__dirname, 'src'), globname),
                        continueWithWarnings: true
                    }))
                    .pipe(gulp.dest('bin'));

    }));
    // .pipe(gulp.dest('bin'))
});
gulp.task('js-no-uglify', function() {
    return gulp.src(paths.js, {base: 'src'})
    .pipe(wrapScope())
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
gulp.task('build-html', ['cp-html', 'css', 'js-no-uglify'], function() {
    return gulp.src('bin/editor-ui.html')
    .pipe(vulcanize({
        dest: 'bin',
        inline: true,
        strip: true,
    }))
    .pipe(gulp.dest('bin'))
    ;
});
gulp.task('build-html-dev', ['cp-html', 'css', 'js-no-uglify'], function() {
    return gulp.src('bin/editor-ui.html')
    .pipe(vulcanize({
        dest: 'bin',
        inline: true,
        strip: false,
    }))
    .pipe(gulp.dest('bin'))
    ;
});

// NOTE: low-level version webkit don't support vulcanize's css strip option. such as background:transparent -> background:0 0  
gulp.task('build-html-polyfill', ['cp-html', 'css', 'js'], function() {
    return gulp.src('bin/editor-ui.html')
    .pipe(vulcanize({
        dest: 'bin',
        inline: true,
        strip: false,
    }))
    .pipe(gulp.dest('bin'))
    ;
});

// watch
gulp.task('watch', function() {
    gulp.watch(paths.ext_core, ['cp-core']).on( 'error', gutil.log );
    gulp.watch(paths.img, ['cp-img']).on ( 'error', gutil.log );
    gulp.watch(paths.js, ['js-no-uglify', 'build-html-dev']).on( 'error', gutil.log );
    gulp.watch(paths.css, ['css', 'build-html-dev']).on( 'error', gutil.log );
    gulp.watch(paths.html, ['build-html-dev']).on( 'error', gutil.log );
});

gulp.task('watch-self', function() {
    gulp.watch(paths.img, ['cp-img']).on ( 'error', gutil.log );
    gulp.watch(paths.js, ['js-no-uglify', 'build-html-dev']).on( 'error', gutil.log );
    gulp.watch(paths.css, ['css', 'build-html-dev']).on( 'error', gutil.log );
    gulp.watch(paths.html, ['build-html-dev']).on( 'error', gutil.log );
});

// tasks
gulp.task('dev', [ 'cp-img', 'build-html-dev'] );
gulp.task('polyfill', [ 'cp-img', 'build-html-polyfill'] );
gulp.task('default', [ 'cp-img', 'build-html'] );
