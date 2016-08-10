var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var htmlmin = require('gulp-htmlmin');
var cssmin = require('gulp-cssmin');
var clean = require('gulp-clean');
var autoprefixer = require('gulp-autoprefixer');
var injectPartials = require('gulp-inject-partials');

var SOURCEPATHS = {
  sourceFolder:'src/',
  htmlSource: 'src/*.html',
  htmlPartialSource: 'src/partial/*.html',
  assetsSource: 'src/assets/',
  bootstrapSource : 'src/scss/bootstrap.scss',
  sassSource: 'src/scss/*.scss',
  jsSource: 'src/assets/js/*.js'
}

var APPPATH = {
  appFolder:  'app/',
  cssFiles: 'app/assets/css/*.css',
  jsFiles: 'app/assets/js/*.js',
  htmlFiles: 'app/*.html'
}

gulp.task('sass', function() {
  return gulp.src(SOURCEPATHS.bootstrapSource)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(APPPATH.appFolder + 'assets/css/'));
});

gulp.task('copy', function () {
    return gulp.src( SOURCEPATHS.assetsSource + '/**/*' )
      .pipe(gulp.dest(APPPATH.appFolder + '/assets'));
});

gulp.task('moveFiles', function() {
    gulp.src(['./bower_components/bootstrap/scss/**/*',
              '!./bower_components/bootstrap/scss/_custom.scss',
              '!./bower_components/bootstrap/scss/bootstrap.scss'])
         .pipe(gulp.dest('src/scss'));
});

gulp.task('html', function() {
  return gulp.src(SOURCEPATHS.htmlSource)
           .pipe(injectPartials())
           .pipe(gulp.dest(APPPATH.appFolder));
});

gulp.task('minifyHtml', function() {
  return gulp.src(SOURCEPATHS.htmlSource)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(APPPATH.appFolder))
});

gulp.task('minifyCss', function() {
    return gulp.src(SOURCEPATHS.bootstrapSource)
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(gulp.dest(APPPATH.appFolder + 'assets/css/'));
})

gulp.task('serve', ['sass'], function() {
  browserSync.init([APPPATH.cssFiles, APPPATH.jsFiles, APPPATH.htmlFiles], {
    server: {
      baseDir: 'app'
    }
  });
});

gulp.task('watch', ['moveFiles', 'html','copy',  'sass', 'serve'], function() {
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  gulp.watch([SOURCEPATHS.sourceFolder]);
  gulp.watch([SOURCEPATHS.htmlSource, SOURCEPATHS.htmlPartialSource] , ['html']);
  gulp.watch([SOURCEPATHS.jsSource], ['js']);
});


// Run the SASS Compiler
gulp.task('default', ['watch']);

// Ready to Production
gulp.task('production', ['minifyHtml', 'minifyCss']);
