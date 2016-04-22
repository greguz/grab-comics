module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt); // load grunt tasks automatically

  require('time-grunt')(grunt); // time how long tasks take

  grunt.initConfig({ // define the configuration for all the tasks

    pkg: grunt.file.readJSON('package.json'),

    less: {

      css: {
        files: {
          "assets/css/bootstrap.css": "source/styles/bootstrap.less"
        }
      }

    },

    handlebars: {

      templates: {
        options: {
          namespace: false,
          node: true,
          commonjs: true
        },
        files: [{
          cwd: 'source/templates/',
          src: '*.hbs',
          dest: 'templates/',
          expand: true,
          rename: function(dest, src) {
            return dest + src.replace('.hbs','.js');
          }
        }]
      }

    }

  });

  grunt.registerTask('default', [
    'less',
    'handlebars'
  ]);

};