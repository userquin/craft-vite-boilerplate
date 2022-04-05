const { images, svg } = require('@malven/gulp-tasks');
const gulp = require('gulp');

//
//   Config
//
//////////////////////////////////////////////////////////////////////

global.GULP_CONFIG = {
  paths: {
    dist: 'web/dist/',

    templateSrc: 'templates/',
    templateDist: 'templates/',

    imageSrc: 'src/images/',
    imageDist: 'web/dist/images/',
  },
};

// Export tasks

const watch = function(done) {
  // Images
  gulp.watch([
    global.GULP_CONFIG.paths.imageSrc + '**/*',
  ], gulp.series(images, svg));

  done();
};

module.exports = {
  default: gulp.series(
    gulp.parallel(
      watch,
      images,
      svg,
    ),
    done => done(),
  ),
  build: gulp.series(
    images,
    svg,
    done => done(),
  ),
};

