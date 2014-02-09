module.exports = function(grunt) {
    var config = {
        ENV : grunt.option('env') || 'dev',
        pkg : grunt.file.readJSON('package.json')
    };

    config.src = grunt.option('src') || '.';

    grunt.initConfig(config);

    grunt.loadTasks('grunt');

    grunt.registerTask('default', ['jshint', 'compass']);
};