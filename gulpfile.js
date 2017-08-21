var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
// CSS
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var minifyCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var sass = require('gulp-sass');
var focus = require('postcss-focus');
var csslint = require('gulp-csslint');
var htmlReporter = require('gulp-csslint-report');
var uncss = require('gulp-uncss');
// Javascript
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');


// Static server
gulp.task('serve', () => {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

     gulp.watch("./*.scss", ['css']).on('change', browserSync.reload);
     gulp.watch("./*.html").on('change', browserSync.reload);
     gulp.watch('./*.js', ['scripts']).on('change', browserSync.reload);;
});

// Transpiling scss, autoprefix, minifying, sourcemaps and :focus
gulp.task('css', () => {
    console.log("Transpiling scss, etc...");
    return gulp.src('./*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([ require('postcss-focus') ]))
        .pipe(postcss([ autoprefixer({ grid: false}) ])) //  IE supports only grid-row with / and span. You should add grid: false option to Autoprefixer and use some JS grid polyfill for full spec support
        // .pipe(csslint())
        // .pipe(csslint.formatter())
        .pipe(htmlReporter({
            'filename': 'csslint-report.html',
            'directory': './csslint-reports/'
        }))
        .pipe(minifyCSS({compatibility: 'ie8'}))
        .pipe(rename({
          suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/css/'));
});

// Remove every unused selectors from the css files -> https://www.npmjs.com/package/gulp-uncss/
// NEED TESTING!!!!!!!!!!!!
gulp.task('purgecss', () => {
    console.log("Purging CSS...");
    return gulp.src('dist/css/*.css')
        .pipe(uncss({
            html: ['index.html']
        }))
        .pipe(gulp.dest('dist/css/purgecss'))
})

// Creating js minified, concatenated and sourcemap files
gulp.task('scripts', () => {
    console.log("Script minify, concatenate and sourcemap files");
    return gulp.src([
            'scripts.js',
            'scripts-2.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('scripts.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/js/'));
});

// gulp.task('watch', () => {
//     gulp.watch('./*.scss', ['css']);
// });

gulp.task('default', ['serve']);