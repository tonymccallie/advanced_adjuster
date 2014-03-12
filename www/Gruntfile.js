module.exports = function(grunt) {
    grunt.initConfig({
        less: {
            development: {
                options: {
                    paths: ['./css']
                },
                files: {
                    './css/styles.css': './css/styles.less'
                }
            },
            production: {
                options: {
                    paths: ['./css'],
                    cleancss: true
                },
                files: {
                    './css/styles.min.css': './css/styles.less'
                }
            }
        },
        concat: {
            dist: {
                options: {
                    banner: '/*! Updated: <%= grunt.template.today("mmmm dS, yyyy, h:MM:ssTT") %> */\n',
                    separator: "\n\n"
                },
                src: [
                    //util libs
                    "util/jquery-2.1.0.min.js",
                    "util/knockout-3.0.0",
                    //uikit
                    "util/uikit/src/js/core.js",
                    "util/uikit/src/js/utility.js",
                    "util/uikit/src/js/touch.js",
                    "util/uikit/src/js/alert.js",
                    "util/uikit/src/js/button.js",
                    "util/uikit/src/js/dropdown.js",
                    "util/uikit/src/js/grid.js",
                    "util/uikit/src/js/modal.js",
                    "util/uikit/src/js/offcanvas.js",
                    "util/uikit/src/js/nav.js",
                    "util/uikit/src/js/tooltip.js",
                    "util/uikit/src/js/switcher.js",
                    "util/uikit/src/js/tab.js",
                    "util/uikit/src/js/search.js",
                    "util/uikit/src/js/scrollspy.js",
                    "util/uikit/src/js/smooth-scroll.js",
                    "util/uikit/src/js/toggle.js",
                ],
                dest: "js/system.js"
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= grunt.template.today("mmmm dS, yyyy, h:MM:ssTT") %> */\n'
            },
            dist: {
                files: {
                    'js/system.min.js':['<%= concat.dist.dest %>']
                }
            }
        },
        watch: {
            css: {
                files: ['./css/*.less'],
                tasks: ['less'],
                options: {
                     livereload: true
                }
            },
            html: {
                files: ['./*.html','./views/*.html'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['./*.js','./js/*.js'],
                tasks: ['concat'],
                options: {
                     livereload: true
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.registerTask('default', ['concat','less:production','watch']);
    grunt.registerTask('build', ['less:production','concat','uglify']); //, 'uglify:production', 'replace'
};