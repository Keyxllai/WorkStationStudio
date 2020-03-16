var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var del = require('del');
var path = require('path');

var name = 'workstation';
var task_compileTS = 'WS';//'compile:' + name + '-ts';
var task_watchTS = 'watch:' + name + '-ts';

var distRoot = path.join(__dirname, '../../dist/src/');

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
            var ofile =  '/source/src/' + infile
            return ofile;
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(distRoot + 'frontend/'));
    return rest;
}

gulp.task(task_compileTS, compileTS);

gulp.task('WSbuild', gulp.series(task_compileTS));