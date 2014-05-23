module.exports = (grunt) ->

    # load task-plugins
    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-contrib-concat'
    grunt.loadNpmTasks 'grunt-contrib-copy'
    grunt.loadNpmTasks 'grunt-contrib-cssmin'
    grunt.loadNpmTasks 'grunt-contrib-jshint'
    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-sass'

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
                dev: 'bin/editor-ui.dev.js'
                min: 'bin/editor-ui.min.js'
            html:
                src: [
                    'src/**/*.html',
                ]
                dest: 'bin/editor-ui.html'

        # task configuration

        # clean
        clean:
            bin:
              src: ['bin/**/*']

        # jshint
        jshint:
            check: 
                src: '<%= files.js.src %>'

        # concat
        concat: 
            js:
                src: '<%= files.js.src %>'
                dest: '<%= files.js.dev %>'
            html:
                src: '<%= files.html.src %>'
                dest: '<%= files.html.dev %>'

        # uglify
        uglify: 
            build:
                src: '<%= files.js.dev %>'
                dest: '<%= files.js.min %>'

        # sass
        sass:
            build:
                options:
                    includePaths: ['src/']
                files:
                    'bin/css/editor-ui.css': 'src/editor-ui.scss'
            build_min:
                options:
                    includePaths: ['src/']
                    outputStyle: 'compressed'
                files:
                    'bin/css/editor-ui.min.css': 'src/editor-ui.scss'

        # cssmin
        cssmin:
            minify:
                expand: true
                cwd: 'bin/'
                src: ['**/*.css', '!**/*.min.css']
                dest: 'bin/'
                ext: '.min.css'

    # Default task(s).
    grunt.registerTask 'default', ['min']

    grunt.registerTask 'min', ['jshint', 'concat', 'uglify', 'copy', 'sass', 'cssmin']
    grunt.registerTask 'dev', ['jshint', 'concat', 'copy', 'sass']

