/* 
* @Author: Justin Webb
* @Date:   2015-07-03 19:45:10
* @Last Modified by:   Justin Webb
* @Last Modified time: 2015-07-13 10:08:26
*/

'use strict';

process.env.NODE_ENV = 'development';


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