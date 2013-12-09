var fs      = require('fs'),
    path    = require('path'),
    config  = {};

function extend(a, b) {
    for (var x in b) {
        a[x] = b[x];
    }
}

fs.readdirSync('./grunt/configs').forEach(function (file) {
    if (path.extname(file) === '.js') {
        extend(config, require('./grunt/configs/' + file));
    }
});

module.exports = function(grunt) {

    extend(config, {
        src: grunt.option('src') || '.'
    });

    grunt.initConfig(config);
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint']);
};