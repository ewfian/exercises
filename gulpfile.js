// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    minifycss = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create(),
    del = require('del');

// 静态服务器
gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: './dist'
        },
        host: '0.0.0.0'
    });
});

// Styles
gulp.task('styles', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .on('error', sass.logError)
        .pipe(autoprefixer('last 2 version'))
        .pipe(cssnano())
        .pipe(minifycss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Scripts
gulp.task('scripts', function () {
    return gulp.src(['src/scripts/polyfill.js', 'src/scripts/**/*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Images
gulp.task('images', function () {
    return gulp.src('src/images/*')
        .pipe(gulp.dest('dist/images'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Html
gulp.task('html', function () {
    return gulp.src('*.html')
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Clean
gulp.task('clean', function () {
    return del('dist/');
});

// Default task
gulp.task('default', ['clean'], function () {
    gulp.start('html', 'styles', 'scripts', 'images');
});

// Watch
gulp.task('watch', ['default', 'serve'], function () {
    // Watch .scss files
    gulp.watch('src/scss/**/*.scss', ['styles']);
    // Watch .js files
    gulp.watch('src/scripts/**/*.js', ['scripts']);
    // Watch images files
    gulp.watch('src/images/*', ['images']);
    // Watch html files
    gulp.watch('*.html', ['html']);
});
