module.exports = (grunt) ->

    # load task-plugins
    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-contrib-copy'
    grunt.loadNpmTasks 'grunt-contrib-jshint'
    grunt.loadNpmTasks 'grunt-contrib-stylus'
    grunt.loadNpmTasks 'grunt-vulcanize'

    # load tasks 
    # grunt.loadTasks 'tasks'

    # Project configuration.
    grunt.initConfig

        # variables
        pkg: grunt.file.readJSON 'package.json'
        files:
            js:
                src: [
                    'src/**/*.js',
                ]

        # task configuration

        # clean
        clean:
            bin:
              src: ['bin/**/*']

        # jshint
        jshint:
            check: 
                src: '<%= files.js.src %>'

        # copy
        copy:
            html: 
                expand: true
                cwd: 'src/'
                src: ['**/*.html']
                dest: 'bin/'
                filter: 'isFile'
            js:
                expand: true
                cwd: 'src/'
                src: ['**/*.js']
                dest: 'bin/'
                filter: 'isFile'

        # stylus
        stylus: 
            build:
                options: 
                    compress: false
                    paths: ['src/']
                files:
                    'bin/unit-input/unit-input.css': 'src/unit-input/unit-input.styl'

        # vulcanize
        vulcanize:
            build:
                options:
                    inline: true
                files:
                    'bin/editor-ui.html': ['bin/**/*.html']

    # Default task(s).
    grunt.registerTask 'default', ['jshint', 'copy', 'stylus', 'vulcanize']

