var gulp = require('gulp');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var copy = require('gulp-copy');
var sass = require('gulp-sass');
var maps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var clean = require('gulp-clean');
var connect = require('gulp-connect');

var outputFileNames = 'all';

var jsFileName = outputFileNames || 'scripts';
var cssFileName = outputFileNames || 'styles';

// concat scripts
gulp.task('concatjs', ['clean'], concatjsTask);

// minify scripts
gulp.task('minifyjs', ['clean', 'concatjs'], minifyjsTask);

// copy scripts to dist
gulp.task('copyjs', ['clean', 'concatjs', 'minifyjs'], copyjsTask);

// compile sass
gulp.task('compilesass', ['clean'], compilesassTask);

// copy css
gulp.task('copycss', ['clean', 'compilesass'], copycssTask);

// copy scripts
gulp.task('scripts', ['copyjs']);

// copy css
gulp.task('styles', ['clean', 'compilesass', 'copycss']);

// minify images and copy to dist
gulp.task('images', ['clean'], minifyimagesTask);

// watch and rebuild
gulp.task('watch', ['build'], watchTask);

// clean dist folder
gulp.task('clean', cleanDistTask);

// start dev server
gulp.task('serve', ['watch'], serveTask);

// clean project files and dist directory
gulp.task('build', ['scripts', 'styles', 'images']);

// run build task
gulp.task('default', ['watch']);


function concatjsTask() {

	return gulp
		.src(['js/circle/*.js', 'js/global.js'])
		.pipe(maps.init())
		.pipe(concat(jsFileName + '.js'))
		.pipe(maps.write('.'))
		.pipe(gulp.dest('js'));
}

function minifyjsTask() {

	return gulp
		.src('js/' + jsFileName + '.js')
		.pipe(minify())
		.pipe(rename(jsFileName + '.min.js'))
		.pipe(gulp.dest('js'));
}

function copyjsTask() {

	return gulp
		.src('js/' + jsFileName + '.min.js')
    .pipe(rename(jsFileName + '.min.js'))
		.pipe(gulp.dest('dist/scripts'))
    .pipe(connect.reload());
}

function compilesassTask() {

	return gulp
		.src('sass/global.scss')
		.pipe(maps.init())
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(maps.write('.'))
		.pipe(gulp.dest('css'));
}

function copycssTask() {

  return gulp
    .src('css/global.css')
    .pipe(rename(cssFileName + '.min.css'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(connect.reload());
}

function minifyimagesTask() {

	return gulp
		.src('images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/content'));
}

function cleanDistTask() {

	return gulp
    .src([
		  './dist/*'
	   ], {read: false})
     .pipe(clean());
}

function watchTask(){

  gulp
    .watch([
      './js/*.js',
      './sass/*.scss',
      '!./**/*.map',
      '!./**/*.min.*'
    ],
    ['build'])
    .on('change', function(event){
      console.log(event);
    });
}

function serveTask(){

  connect.server({
    port: 8080,
    livereload: true
  });
}
