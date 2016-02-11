'use strict';

var browserify = require('browserify'),
    babelify = require('babelify'),
    path = require('path'),
    globSync = require('glob').sync;

var babelOptions = {
  presets: ['es2015', 'stage-1'],
  plugins: ['transform-runtime'],
  compact: false
};
var browserifyOptions = {
};

var testFilesGlob = path.join(process.cwd(), 'test', '**', '*Test.js');
var testFiles = globSync(testFilesGlob);

browserify(testFiles, browserifyOptions)
  .transform(babelify, babelOptions)
  .bundle()
  .pipe(process.stdout);
