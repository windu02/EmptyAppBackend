module.exports = function (grunt) {
  'use strict';

  // load extern tasks
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');


  // tasks
  grunt.initConfig({

// ---------------------------------------------
//                          build and dist tasks
// ---------------------------------------------
    copy: {
      buildDatabase : {
        files: 	[{expand: true, cwd: 'database', src: ['**'], dest: 'build/database/'}]
      },
      buildBackendConfigInfosFile: {
        files: 	[{'build/backend_config.json': 'scripts/core/backend_config.json'}]
      },

      distDatabase : {
        files: 	[{expand: true, cwd: 'database', src: ['**'], dest: 'dist/database/'}]
      },
      distBackendConfigInfosFile: {
        files: 	[{'dist/backend_config.json': 'scripts/core/backend_config.json'}]
      },

      testDatabase : {
        files: 	[{expand: true, cwd: 'database', src: ['**'], dest: 'buildTests/database/'}]
      },
      testBackendConfigInfosFile: {
        files: 	[{'buildTests/backend_config.json': 'scripts/core/backend_config.json'}]
      },

      dbInitDatabase : {
        files: 	[{expand: true, cwd: 'database', src: ['**'], dest: 'buildDBInit/database/'}]
      },
      dbInitFiles : {
        files: 	[{expand: true, cwd: 'dbInitFiles', src: ['**'], dest: 'buildDBInit/dbInitFiles/'}]
      },

      heroku: {
        files: 	[{expand: true, cwd: 'dist', src: ['**'], dest: 'heroku'}]
      },
      herokuProcfile: {
        files: 	[{expand: true, cwd: '.', src: ['Procfile'], dest: 'heroku'}]
      },
      herokuGitignore: {
        files: 	[{expand: true, cwd: '.', src: ['.gitignore'], dest: 'heroku'}]
      }
    },

    typescript: {
      build: {
        src: [
          'scripts/Backend.ts'
        ],
        dest: 'build/Backend.js',
        options: {
          module: 'commonjs',
          basePath: 'scripts'
        }
      },

      dist: {
        src: [
          'scripts/Backend.ts'
        ],
        dest: 'dist/Backend.js',
        options: {
          module: 'commonjs',
          basePath: 'scripts'
        }
      },

      test: {
        src: [
          'tests/**/*.ts'
        ],
        dest: 'buildTests/Test.js'
      },

      dbinit: {
        src: [
          'scripts/CleanAndInitDatabase.ts'
        ],
        dest: 'buildDBInit/CleanAndInitDatabase.js',
        options: {
          module: 'commonjs',
          basePath: 'scripts'
        }
      }
    },

    express: {
      options: {
        port: 4000
      },
      build: {
        options: {
          script: 'build/Backend.js',
          args: ["loglevel=debug"]
        }
      },
      dist: {
        options: {
          script: 'dist/Backend.js',
          args: ["loglevel=error"],
          node_env: 'production'
        }
      }
    },
// ---------------------------------------------

// ---------------------------------------------
//                                 develop tasks
// ---------------------------------------------
    watch: {
      express: {
        files:  [ 'build/Backend.js' ],
        tasks:  [ 'express:build' ],
        options: {
          spawn: false
        }
      },

      developServer: {
        files: ['scripts/**/*.ts', 'database/**/*.js'],
        tasks: ['typescript:build']
      }
    },
// ---------------------------------------------

// ---------------------------------------------
//                                 doc tasks
// ---------------------------------------------
    yuidoc: {
      compile: {
        name: 'Backend',
        description: 'Backend.',
        version: '0.0.1',
        url: 'http://example.com',
        options: {
          extension: '.ts, .js',
          paths: ['scripts/'],
          outdir: 'doc/'
        }
      }
    },
// ---------------------------------------------

// ---------------------------------------------
//                                 test tasks
// ---------------------------------------------
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          colors: true
        },
        src: ['buildTests/Test.js']
      }
    },
// ---------------------------------------------

// ---------------------------------------------
//                                    clean task
// ---------------------------------------------
    clean: {
//      package: ['package-bak.json', 'package-tmp.json'],
      build: ['build/'],
      heroku: ['heroku/'],
      dist: ['dist/'],
      doc: ['doc'],
      test: ['buildTests/']
    }
// ---------------------------------------------
  });

  // register tasks
  grunt.registerTask('default', ['build']);

  grunt.registerTask('build', function () {
    grunt.task.run(['clean:build']);

    grunt.task.run(['copy:buildDatabase', 'copy:buildBackendConfigInfosFile', 'typescript:build']);
  });

  grunt.registerTask('develop', ['build', 'express:build', 'watch']);

  grunt.registerTask('dist', function () {
    grunt.task.run(['clean:dist']);

    grunt.task.run(['copy:distDatabase', 'copy:distBackendConfigInfosFile', 'typescript:dist']);
  });

  grunt.registerTask('test', function() {
    grunt.task.run(['clean:test']);

    grunt.task.run(['copy:testDatabase', 'copy:testBackendConfigInfosFile', 'typescript:test', 'mochaTest:test']);
  });


  grunt.registerTask('dbinit', function () {
    grunt.task.run(['clean:build']);

    grunt.task.run(['copy:buildConnectionInfosFile', 'copy:buildBackendConfigInfosFile', 'copy:dbInitFiles', 'typescript:dbinit']);
  });//TODO : To check !

  grunt.registerTask('heroku', function () {
    grunt.task.run(['clean:heroku']);

    grunt.task.run(['dist', 'copy:heroku', 'copy:herokuProcfile', 'copy:herokuGitignore']);
  });//TODO : To check !

  grunt.registerTask('doc', ['clean:doc', 'yuidoc']);

}