// Gulpfile.js
var gulp = require('gulp')
  , nodemon = require('gulp-nodemon')

gulp.task('dev', function (done) {
  nodemon({
    script: 'index.js'
  , ext: 'js html'
//  , args: ['--env-file=.env']
  , ignore: ['node_modules/']
//  , env: { 'NODE_ENV': 'development' }
  , done: done
  })
})
