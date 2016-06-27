var gulp = require('gulp'),
serve = require("gulp-serve"),
copy = require("gulp-copy");


var jsFiles = {
  vendor: [
      "node_modules/html-to-amp/dist/index.js"
  ]
}

gulp.task('copy-vendor', function(){
  return gulp.src(jsFiles.vendor)
  .pipe(copy('public/js/vendor', {prefix: 3}));
})

gulp.task('serve', serve('public'));
gulp.task('serve-build', serve(['public', 'build']));
gulp.task('serve-prod', serve({
  root: ['public', 'build'],
  port: 443,
  https: true,
  middleware: function(req, res) {
    // custom optional middleware
  }
}));

gulp.task('default', ['serve']);
