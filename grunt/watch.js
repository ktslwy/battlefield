'use strict';

module.exports = function(grunt) {
    grunt.config.set('watch', {
        compass: {
            files: ['styles/**/*.scss'],
            tasks: ['compass']
        },
        jshint: {
            files: [
                '{controllers,lib,models}/**/*.js', 'public/js/*.js', '*.js', 'package.json',
                'grunt/**/*.js', 'test/**/*.js', 'samples/**/*.json', 'Gruntfile.js'
            ],
            tasks: ['jshint']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
};