'use strict';

var gulp = require('gulp'),
  del = require('del'),
  fs = require('fs'),
  sass = require('gulp-sass'),
  zip = require('gulp-zip'),
  manifest = require('gulp-chrome-manifest'),
  replace = require('gulp-replace'),
  bump = require('gulp-bump');

// Config
var SRC_DIR = './src';
var DIST_DIR = './dist';
var PACKAGE_DIR = './package';
var MANIFEST = './manifest.json';

// Compile SASS to CSS
gulp.task('sass', function () {
  return gulp
    .src([SRC_DIR + '/**/*.scss'])
    .pipe(sass({ style: 'expanded' }))
    .on('error', sass.logError)
    .pipe(gulp.dest(SRC_DIR));
});

// Delete everything from dist directory
gulp.task('clean', function () {
  return del([DIST_DIR + '/**/*']);
});

// Copy all files to dist folder
gulp.task('copy', ['clean', 'sass', 'version'], function (cb) {
  gulp
    .src('./_locales/**/*')
    .pipe(gulp.dest(DIST_DIR + '/_locales'));
  gulp
    .src('./icons/**')
    .pipe(gulp.dest(DIST_DIR + '/icons'));
  gulp
    .src(SRC_DIR + '/**/*')
    .pipe(gulp.dest(DIST_DIR));
  cb();
});

// VERSION

/**
 * Bump version of extension in manifest.json and package.json
 * @param type ['patch'|'minor'|'major']
 * @returns {*}
 */
function bumpVersion(type) {
  return gulp
    .src([MANIFEST, './package.json'])
    .pipe(bump({ type: type }))
    .pipe(gulp.dest('./'))
}

gulp.task('version', function () {
  return bumpVersion('patch');
});
gulp.task('version:prerelease', function () {
  return bumpVersion('prerelease');
});
gulp.task('version:patch', function () {
  return bumpVersion('patch');
});
gulp.task('version:minor', function () {
  return bumpVersion('minor');
});
gulp.task('version:major', function () {
  return bumpVersion('major');
});

// Copy manifest to dist and update paths
gulp.task('manifest', ['copy'], function () {
  return gulp
    .src(MANIFEST)
    .pipe(replace('src/', ''))
    .pipe(gulp.dest(DIST_DIR))
});

// PACKAGE

function packageName() {
  var manifest = JSON.parse(fs.readFileSync(MANIFEST));
  return (manifest.name.trim().replace(/\s/g, '-').toLowerCase()) + '-' + manifest.version;
}

function createPackage() {
  return gulp
    .src(DIST_DIR + '/**/*')
    .pipe(zip(packageName() + '.zip'))
    .pipe(gulp.dest(PACKAGE_DIR));
}

// Watch sass files for change
gulp.task('watch', ['sass'], function () {
  return gulp.watch(SRC_DIR + '/**/*.scss', ['sass']);
});

gulp.task('build', ['manifest']);
gulp.task('package', createPackage);
gulp.task('default', ['watch']);
