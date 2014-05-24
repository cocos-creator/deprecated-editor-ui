module.exports = (grunt) ->

    # load task-plugins
    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-contrib-concat'
    grunt.loadNpmTasks 'grunt-contrib-copy'
    grunt.loadNpmTasks 'grunt-contrib-cssmin'
    grunt.loadNpmTasks 'grunt-contrib-jshint'
    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-sass'
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

        # uglify
        uglify: 
            build:
                files: [{
                    expand: true
                    cwd: 'src'
                    src: '**/*.js'
                    dest: 'bin'
                }]

        # copy
        copy:
            html: 
                expand: true
                cwd: 'src/'
                src: ['**/*.html']
                dest: 'bin/'
                filter: 'isFile'

        # sass
        sass:
            build:
                options:
                    includePaths: ['src/']
                    outputStyle: 'compressed'
                files:
                    'bin/unit-input/unit-input.css': 'src/unit-input/unit-input.scss'
                    # 'bin/checkbox/checkbox.css': 'src/checkbox/checkbox.scss'

        # # cssmin
        # cssmin:
        #     minify:
        #         expand: true
        #         cwd: 'bin/'
        #         src: ['**/*.css', '!**/*.min.css']
        #         dest: 'bin/'
        #         ext: '.min.css'

        vulcanize:
            build:
                options:
                    inline: true
                files:
                    'bin/editor-ui.html': ['bin/**/*.html']

    # Default task(s).
    grunt.registerTask 'default', ['min']

    grunt.registerTask 'min', ['jshint', 'uglify', 'copy', 'sass', 'vulcanize']
    grunt.registerTask 'dev', ['jshint', 'copy', 'sass', 'vulcanize']

