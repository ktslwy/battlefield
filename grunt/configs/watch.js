module.exports = {
    watch: {
        jshint: {
            files: [
                '{controllers,lib,models}/**/*.js', 'index.js', 'package.json',
                'grunt/**/*.js', 'test/**/*.js', 'samples/**/*.json', 'Gruntfile.js'
            ],
            tasks: ['jshint']
        }
    }
};
