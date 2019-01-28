var args           = require('yargs').argv;
var autoprefixer   = require('gulp-autoprefixer');
var browserSync    = require('browser-sync').create();
var cssnano        = require('gulp-cssnano');
var gulp           = require('gulp');
var gulpif         = require('gulp-if');
var insert         = require('gulp-insert');
var moduleImporter = require('sass-module-importer');
var notify         = require('gulp-notify');
var pump           = require('pump');
var rename         = require('gulp-rename');
var sass           = require('gulp-sass');
var watch          = require('gulp-watch');

var paths = {
    src: ['src/**/*.scss', 'demo/**/*.scss'],
};

gulp.task('css', function(cb) {
    pump([
        gulp.src(paths.src, {base:'.'}),
        sass({
            importer: moduleImporter(),
            outputStyle: 'expanded',
        }).on('error', sass.logError),
        autoprefixer(),
        gulpif(args.production, cssnano({
            discardComments: {removeAll: true}
        })),
        insert.prepend('/*! nolie | MIT License | https://github.com/pryley/nolie.css */'),
        rename(function(path) {
            path.dirname = path.dirname.replace('src', 'dist');
        }),
        gulp.dest('.'),
        browserSync.stream(),
        notify({
            message: 'CSS Task complete!',
            onLast : true
        }),
    ], cb);
});

gulp.task('watch', function() {
    browserSync.init({
        server: {baseDir: 'demo'},
    });
    gulp.watch(paths.src, gulp.parallel('css'));
    gulp.watch('demo/*.html').on('change', browserSync.reload);
});

gulp.task('default', gulp.series('css'));
