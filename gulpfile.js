// Include gulp
var gulp = require('gulp');
mainBowerFiles = require('main-bower-files');
 


// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('dist/css'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(['js/*.js'])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'scripts']);
    gulp.watch('scss/*.scss', ['sass']);
});
gulp.task('bower', function() {
    // mainBowerFiles is used as a src for the task,
    // usually you pipe stuff through a task
    return gulp.src(mainBowerFiles())
        // Then pipe it to wanted directory, I use
        // dist/lib but it could be anything really
         .pipe(gulp.dest('js'))
});

// Default Task
gulp.task('default', ['lint', 'sass', 'scripts', 'watch']);
