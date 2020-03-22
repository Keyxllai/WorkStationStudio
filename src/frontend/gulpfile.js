var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var del = require('del');
var path = require('path');

var name = 'workstation';
var task_compileTS = 'compile:' + name + '-ts';
var task_watchTS = 'watch:' + name + '-ts';
var task_copyHtmlFile = 'copy:' + name + '-html';
var task_watchHtmlFile = 'watch:' + name + '-html';

var distRoot = path.join(__dirname, '../../dist/src/');

gulp.task('clean', gulp.series(function () {
    var out = path.join(__dirname, '../../dist/src');
    return del([out + '/*']);
}))

var compileTS = function () {
    var fileRoot = __dirname;
    var tsProj = ts.createProject(fileRoot + '/tsconfig.json');
    var include = tsProj.config.include;
    for (var i = 0; i < include.length; i++) {
        include[i] = path.join(fileRoot, include[i]);
    }
    var rest = gulp.src(include)
        .pipe(sourcemaps.init())
        .pipe(tsProj())
        .pipe(sourcemaps.mapSources(function (sourcePath, file) {
            console.log(sourcePath);
            var infile = sourcePath.replace('../', '/');
            var ofile = '/source/src/' + infile
            return sourcePath;
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(distRoot + 'frontend/'));
    return rest;
}

var watchTS = function () {
    let fileRoot = path.join(__dirname, '/frontend/**/*.ts');
    fileRoot = fileRoot.split('\\').join('/');
    return gulp.watch(fileRoot, gulp.series(task_compileTS));
}

gulp.task(task_compileTS, compileTS);
gulp.task(task_watchTS, watchTS);

var copyHtmlFiles = function () {
    return gulp.src([__dirname + '/file/**/*.html', __dirname + '/file/**/*.css'], __dirname + '/assets/**/*.*')
        .pipe(gulp.dest(distRoot + 'frontend/file/'));
}

var watchHtmlFiles = function () {
    var inputs = [__dirname + '/file'];
    gulp.watch(inputs, gulp.series(copyHtmlFiles));
}

gulp.task(task_copyHtmlFile, copyHtmlFiles);
gulp.task(task_watchHtmlFile, watchHtmlFiles);

gulp.task('build', gulp.series(task_compileTS, task_copyHtmlFile))
gulp.task('watch', gulp.parallel(task_watchTS, task_watchHtmlFile))


gulp.task('default', gulp.series('clean', 'build', 'watch'));
//gulp.task('WSbuild', gulp.series(task_compileTS));