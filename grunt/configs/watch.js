module.exports = {
    watch: {
        jshint: {
            files: [
                '{controllers,lib,models}/**/*.js', '*.js', 'package.json',
                'grunt/**/*.js', 'test/**/*.js', 'samples/**/*.json', 'Gruntfile.js'
            ],
            tasks: ['jshint']
        }
    }
};
