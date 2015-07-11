/* 
* @Author: Justin Webb
* @Date:   2015-07-03 19:45:10
* @Last Modified by:   justinwebb
* @Last Modified time: 2015-07-11 00:19:09
*/

'use strict';

module.exports  = {
  ghost: {
    app: { 
      config: __dirname + '/ghost-config.js'
    }
  },
  dist: 'dist',
  dev: {
    root: 'content/themes/dev',
    assets: {
      js: 'content/themes/dev/assets/js',
      css: 'content/themes/dev/assets/css',
      fonts: 'content/themes/dev/assets/fonts' 
    }
  },
  src_files : {
    everything: ['/**/*'],
    fonts: ['fonts/*.{eot,svg,ttf,woff,otf}'],
    hbs: ['templates/**/*.hbs'],
    js: ['js/**/*.js'],
    scss: ['css/**.scss'],
    support: ['support/**/*']
  }
};