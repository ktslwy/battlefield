module.exports = function (grunt) {
    grunt.config.set('compass', {
        compile: {
            options: {
                sassDir: 'styles/css',
                cssDir: 'public/css',
                environment: 'production',
                'output-style': 'expanded'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-compass');
};