var gulp = require('gulp');
var ghost = require('ghost');
var lazypipe = require('lazypipe');
var browserSync = require('browser-sync');
var sync = require('run-sequence');
var plugins = require('gulp-load-plugins')();
var config = require('./build.config');
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
gulp.task('templates_livereload', function () {
	var embed_live_reload = lazypipe()
		.pipe(plugins.rename, function (path) {
				path.extname = '.html';
			}
		)
		.pipe(plugins.embedlr)
		.pipe(plugins.rename, function (path) {
				path.extname = '.hbs';
			}
		);

	gulp.src(config.src_files.hbs)
		.pipe(plugins.plumber(onError))
		.pipe(plugins.gulpif(function (file) {
				return endsWith(file.path, 'default.hbs');
			}, embed_live_reload()
		))
		.pipe(gulp.dest(config.dev.root));
});

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
// just run a live reload server and watch files for changes
//
gulp.task('launchGhost', function () {
	var test = null;
	ghost(config.ghost.app).then(function (ghostServer) {
		test = ghostServer.start();
	});
	console.log('Serve: ', test);
});

gulp.task('serve', function (cb) {
	var compilerTasks = ['sass', 'js', 'templates_livereload', 'fonts', 'support'];
	sync(compilerTasks, 'launchGhost', cb);
});

//
// just run a live reload server and watch files for changes
//
gulp.task('watch', function () {

	gulp.watch(config.src_files.sass, ['sass']);
	gulp.watch(config.src_files.hbs, ['templates_livereload']);
	gulp.watch(config.src_files.fonts, ['fonts']);
	gulp.watch(config.src_files.support, ['support']);
	gulp.watch(config.src_files.js, ['js']);

	gulp.watch(config.dev.assets.css, browserSync.reload);
	gulp.watch(config.dev.assets.hbs, browserSync.reload);

});

gulp.task('preview', function () {	
		browserSync({
	    proxy: 'localhost:2368'
		});
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
// default task, compile everything and launch preview server
// 
gulp.task('default', function (cb) {
	sync(['serve', 'watch'], 'preview', cb);
});
