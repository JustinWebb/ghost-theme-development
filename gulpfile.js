var gulp = require('gulp');
var ghost = require('ghost');
var lazypipe = require('lazypipe');
var browserSync = require('browser-sync');
var sync = require('run-sequence');
var plugins = require('gulp-load-plugins')();
var config = require('./build.config');
var isFirstRun = true;
var autoprefixBrowsers = ['last 2 version', 'safari 5', 'ie 9', 'opera 12.1'];


// add plugins that do not autoload
plugins.minifyCSS = require('gulp-minify-css');
plugins.gulpif = require('gulp-if');


var onError = function (err) {
	plugins.util.log(plugins.util.colors.red('Error'), err.message);
        this.emit('end');
};

var endsWith = function (str, suffix) {
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

//
// compile scss files and emit normal version + source map and a
// minified version
//
gulp.task('sass', function () {
	gulp.src(config.src_files.scss)
		.pipe(plugins.plumber(onError))
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.sass())
		.pipe(plugins.colorguard())
		.pipe(plugins.autoprefixer(autoprefixBrowsers))
		.pipe(plugins.sourcemaps.write('.'))
		.pipe(gulp.dest(config.dev.assets.css));
});

gulp.task('sass_minify', function () {
	gulp.src(config.src_files.scss)
		.pipe(plugins.sass())
		.pipe(plugins.colorguard())
		.pipe(plugins.autoprefixer(autoprefixBrowsers))
		.pipe(plugins.minifyCSS())
		.pipe(gulp.dest(config.dev.assets.css));
});

//
// concat all javascript files to site.js
//
gulp.task('js', function () {
	gulp.src(config.src_files.js)
		.pipe(plugins.plumber(onError))
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.concat('site.js'))
		.pipe(plugins.sourcemaps.write('.'))
		.pipe(gulp.dest(config.dev.assets.js));
});

gulp.task('js_minify', function () {
	gulp.src(config.src_files.js)
		.pipe(plugins.concat('site.js'))
		.pipe(gulp.dest(config.dev.assets.js));
});

//
// copy handlebars theme files over
//
gulp.task('templates', function () {
	gulp.src(config.src_files.hbs)
		.pipe(gulp.dest(config.dev.root));
});

//
// copy support over
//
gulp.task('support', function () {
	gulp.src(config.src_files.support)
		.pipe(gulp.dest(config.dev.root));
});

//
// copy font files over
//
gulp.task('fonts', function () {
	gulp.src(config.src_files.fonts)
		.pipe(gulp.dest(config.dev.assets.fonts));
});


//
// Start Ghost as NPM module and ensure no progress without
// successful instantiation
//
gulp.task('launchGhost', function (cb) {
	ghost(config.ghost.app)
		.then(function (ghostServer) {
			return ghostServer.start();
		}).then(function (ghostInstance) {
				// console.log('GHOST -------->\n', ghostInstance);
				console.log('Ghost is ready...');
				cb();
		});
});

//
// Compile source files and launch Ghost theme-dev instance
//
gulp.task('serve', function (cb) {
	var compilerTasks = ['sass', 'js', 'templates', 'fonts', 'support'];
	sync(compilerTasks, 'launchGhost', cb);
});


//
// Launch preview server on top of running Ghost instance
//
gulp.task('preview', function (cb) {	
		browserSync({
	    proxy: 'localhost:2368'
		});

	cb();
});

//
// Trigger livereload on preview server after changes to theme
// source files
//
gulp.task('watch', function () {
	gulp.watch(config.dev.theme_files, browserSync.reload);

	gulp.watch(config.src_files.scss, ['sass']);
	gulp.watch(config.src_files.hbs, ['templates']);
	gulp.watch(config.src_files.js, ['js']);
	gulp.watch(config.src_files.fonts, ['fonts']);
	gulp.watch(config.src_files.support, ['support']);
});

//
// compile source files into deployable files
//
gulp.task('build', [
	'sass_minify',
	'js_minify',
	'templates', 
	'fonts', 
	'support'
]);

//
// package theme files for distribution
//
gulp.task('dist', ['build'], function () {
	gulp.src(config.src_files.everything)
		.pipe(plugins.gulpif(function (file) {
				return !endsWith(file.path, '.map');
			}, plugins.zip('dev-theme.zip')
		))
		.pipe(gulp.dest('.'));
});

//
// default task; compile everything, start Ghost and launch 
// the BrowserSync preview server
// 
gulp.task('default', function (cb) {
	sync('serve', 'preview', 'watch', cb);
});
