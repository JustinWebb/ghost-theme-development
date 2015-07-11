/* 
* @Author: Justin Webb
* @Date:   2015-07-03 19:45:10
* @Last Modified by:   justinwebb
* @Last Modified time: 2015-07-03 21:00:07
*/

'use strict';

module.exports  = {
  ghost: {
    themes: '../../Ghost/content/themes',
    src: 'dist/**/*'
  },
  dist : 'dist',
  css_dir : 'dist/assets/css',
  src_files : {
    hbs: ['src/**/*.hbs'],
    sass: ['src/assets/css/**.scss']
  }
};