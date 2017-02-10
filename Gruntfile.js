// Generated on 2014-06-23 using generator-angular 0.7.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'
require('dotenv').config()

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Modrewrite definition
  var modRewrite = require('connect-modrewrite');

  // Define the configuration for all the tasks
  grunt.initConfig({
    //Environment variables
    env: {
      dev: {
        LELYLAN_API_PUBLIC_URL: 'localhost:8000',
        LELYLAN_PEOPLE_PUBLIC_URL: 'localhost:3000',
        LELYLAN_CLIENT_ID: '0e9819715cce6100d8e95e734a42f94f628f91cc5934f8014b91efedb799d36e',
        LELYLAN_TYPES_DASHBOARD_PUBLIC_URL: 'lelylan.github.io/types-dashboard-ng',
        LELYLAN_DEVICES_DASHBOARD_PUBLIC_URL: 'localhost:9000',
        LELYLAN_DEV_CENTER_PUBLIC_URL: 'dev.lelylan.com',
        LELYLAN_WEBSOCKETS_PUBLIC_URL: '127.0.0.1:8002',
        LELYLAN_NODES_PUBLIC_URL: 'localhost:8003',
        PUBLIC_HOST: 'localhost',
        LISTEN_HOST: 'localhost',
        PORT: 9000
      },
      prod: {
        LELYLAN_API_PUBLIC_URL: process.env.LELYLAN_API_PUBLIC_URL || 'api.lelylan.com',
        LELYLAN_PEOPLE_PUBLIC_URL: process.env.LELYLAN_PEOPLE_PUBLIC_URL || 'people.lelylan.com',
        LELYLAN_CLIENT_ID: process.env.LELYLAN_CLIENT_ID || '3bfdab6de9b9f2b82c595bd8befef178d5ea929dc40b0848de6a67b2a182d709',
        LELYLAN_DEVICES_DASHBOARD_PUBLIC_URL: process.env.LELYLAN_DEVICES_DASHBOARD_PUBLIC_URL || 'lelylan.github.io/devices-dashboard-ng',
        LELYLAN_TYPES_DASHBOARD_PUBLIC_URL: process.env.LELYLAN_TYPES_DASHBOARD_PUBLIC_URL || 'lelylan.github.io/types-dashboard-ng',
        LELYLAN_WEBSOCKETS_PUBLIC_URL: process.env.LELYLAN_WEBSOCKETS_PUBLIC_URL || 'lelylan-websockets.herokuapp.com',
        LELYLAN_DEV_CENTER_PUBLIC_URL: process.env.LELYLAN_DEV_CENTER_PUBLIC_URL || 'dev.lelylan.com',
        LELYLAN_NODES_PUBLIC_URL: process.env.LELYLAN_NODES_PUBLIC_URL || 'nodes.lelylan.com',
        PUBLIC_HOST: process.env.PUBLIC_HOST || 'lelylan.github.io/devices-dashboard-ng',
        LISTEN_HOST: process.env.LISTEN_HOST || '0.0.0.0',
        PORT: process.env.PORT || 80
      }
    },

    // Project settings
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: 'dist'
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: process.env.PORT,
        hostname: process.env.LISTEN_HOST,
        livereload: 35729,

        // middleware
        middleware: function(connect, options) {
          var middlewares = [];

          middlewares.push(modRewrite(['^[^\\.]*$ /index.html [L]'])); //Matches everything that does not contain a '.' (period)
          options.base.forEach(function(base) {
            middlewares.push(connect.static(base));
          });
          return middlewares;
        }
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            'test',
            '<%= yeoman.app %>'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= yeoman.app %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: false,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    'bower-install': {
      app: {
        html: '<%= yeoman.app %>/index.html',
        ignorePath: '<%= yeoman.app %>/'
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= yeoman.app %>/images',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        importPath: '<%= yeoman.app %>/bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= yeoman.dist %>/images/generated'
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            //'<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'bower_components/**/*',
            'images/{,*/}*.{webp}',
            'fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true, cwd: '<%= yeoman.app %>', src: ['scripts/vendors/*'], dest: '<%= yeoman.dist %>'
        }, {
          expand: true, cwd: 'test/', src: ['spec/fixtures/*'], dest: '<%= yeoman.dist %>'
        }, {
          expand: true, cwd: '<%= yeoman.app %>/bower_components/fontawesome', src: ['fonts/*'], dest: '<%= yeoman.dist %>'
        }, {
          expand: true, cwd: '<%= yeoman.app %>/bower_components/device-directive-ng/dist/', src: ['fonts/*/**'], dest: '<%= yeoman.dist %>/styles'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server'
      ],
      test: [
        'compass'
      ],
      dist: [
        'compass:dist',
        //'imagemin',
        'svgmin'
      ]
    },

    ngconstant: {
      // Options for all targets
      options: {
        space: '  ',
        wrap: '"use strict";\n\n {%= __ngModule %}',
        name: 'config',
      },
      // Environment targets
      development: {
        options: {
          dest: '<%= yeoman.app %>/scripts/config.js'
        },
        constants: {
          ENV: {
            name: 'development',
            endpoint: 'http://' + process.env.LELYLAN_API_PUBLIC_URL,
            credentials: {
              site: 'http://' + process.env.LELYLAN_PEOPLE_PUBLIC_URL,
              clientId: process.env.LELYLAN_CLIENT_ID,
              redirectUri: 'http://' + process.env.LELYLAN_DEVICES_DASHBOARD_PUBLIC_URL,
              profileUri: 'http://' + process.env.LELYLAN_API_PUBLIC_URL + '/me'
            },
            websocket: 'ws://' + process.env.LELYLAN_WEBSOCKETS_PUBLIC_URL + '/'
          }
        }
      },
      production: {
        options: {
          dest: '<%= yeoman.app %>/scripts/config.js'
        },
        constants: {
          ENV: {
            name: 'production',
            endpoint: 'http://' + process.env.LELYLAN_API_PUBLIC_URL,
            credentials: {
              site: 'http://' + process.env.LELYLAN_PEOPLE_PUBLIC_URL,
              clientId: process.env.LELYLAN_CLIENT_ID,
              redirectUri: 'http://' + process.env.LELYLAN_DEVICES_DASHBOARD_PUBLIC_URL,
              profileUri: 'http://' + process.env.LELYLAN_API_PUBLIC_URL + '/me'
            },
            websocket: 'ws://' + process.env.LELYLAN_WEBSOCKETS_PUBLIC_URL + '/'
          }
        }
      }
    },

    // search and replace for specific strings in the code
    'string-replace': {
      dist: {
        files: {
          './': 'dist/**/*'
        },
        options: {
          replacements: [{
            pattern: /http:\/\/127.0.0.1:8002/g,
            replacement: 'http://' + process.env.LELYLAN_DEVICES_DASHBOARD_PUBLIC_URL + '/bower_components/'
          },{
            pattern: /api.lelylan.com/g,
            replacement: process.env.LELYLAN_API_PUBLIC_URL
          },{
            pattern: /people.lelylan.com/g,
            replacement: process.env.LELYLAN_PEOPLE_PUBLIC_URL
          },{
            pattern: /3bfdab6de9b9f2b82c595bd8befef178d5ea929dc40b0848de6a67b2a182d709/g,
            replacement: process.env.LELYLAN_CLIENT_ID
          },{
            pattern: /lelylan.github.io\/devices-dashboard-ng/g,
            replacement: process.env.LELYLAN_DEVICES_DASHBOARD_PUBLIC_URL
          },{
            pattern: /lelylan-websockets.herokuapp.com/g,
            replacement: process.env.LELYLAN_WEBSOCKETS_PUBLIC_URL
          },{
            pattern: /http:\/\/localhost\/bower_components\/socket.io-client\/socket.io.js/g,
            replacement: 'http://' + process.env.PUBLIC_HOST + '/bower_components/socket.io-client/socket.io.js'
          },{
            pattern: /dev.lelylan.com/g,
            replacement: process.env.LELYLAN_DEV_CENTER_PUBLIC_URL
          },{
            pattern: /nodes.lelylan.com/g,
            replacement: process.env.LELYLAN_NODES_PUBLIC_URL
          },{
            pattern: /lelylan.github.io\/types-dashboard-ng/g,
            replacement: process.env.LELYLAN_TYPES_DASHBOARD_PUBLIC_URL
          }]
        }
      },
      nodes: {
        files: {
          './': 'dist/scripts/**/*.js',
          'device-directive-ng': 'dist/bower_components/device-directive-ng/dist/views/templates/default.html'
        },
        options: {
        replacements: [{
            pattern: /nodes.lelylan.com/g,
            replacement: process.env.LELYLAN_NODES_PUBLIC_URL
          }]
        }
      },
      'types-dashboard': {
        files: {
          'type-directive-ng': 'dist/bower_components/type-directive-ng/dist/views/templates/default.html',
          'device-directive-ng': 'dist/bower_components/device-directive-ng/dist/views/templates/default.html'
        },
        options: {
        replacements: [{
            pattern: /lelylan.github.io\/types-dashboard-ng/g,
            replacement: process.env.LELYLAN_TYPES_DASHBOARD_PUBLIC_URL
          }]
        }
      },
      'dev-center': {
        files: {
          './': 'dist/views/create.html',
          'type-directive-ng': 'dist/bower_components/type-directive-ng/dist/views/templates/default.html',
          'device-directive-ng': 'dist/bower_components/device-directive-ng/dist/views/templates/default.html'
        },
        options: {
        replacements: [{
            pattern: /dev.lelylan.com/g,
            replacement: process.env.LELYLAN_DEV_CENTER_PUBLIC_URL
          }]
        }
      }
    },

    buildcontrol: {
      options: {
        dir: 'dist',
        commit: true,
        push: true,
        message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
      },
      pages: {
        options: {
          remote: 'git@github.com:lelylan/devices-dashboard-ng.git',
          branch: 'gh-pages'
        }
      }
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }
  });


  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'env:dev',
      'clean:server',
      'ngconstant:development',
      'bower-install',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('test', [
    'env:dev',
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'env:prod',
    'clean:dist',
    'bower-install',
    'ngconstant:production',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngmin',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    //'htmlmin',
    'string-replace'
  ]);

  grunt.registerTask('default', [
    'env:dev',
    'newer:jshint',
    'test',
    'build'
  ]);
};
