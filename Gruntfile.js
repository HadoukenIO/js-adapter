module.exports = function(grunt) {

    grunt.initConfig({
        ts: {
            default: {
                tsconfig: true
            }
        },
        tslint: {
            default: {
                src: "src/**/*.ts"
            },
            options: {
                configuration: "tslint.json"
            }
        },
        mochaTest: {
            default: {
                src: "test/**/*.js"
            }
        }
    });

    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-tslint");
    grunt.loadNpmTasks("grunt-mocha-test");

    grunt.registerTask("default", [ "lint", "build" ]);
    grunt.registerTask("test", [ "default", "mochaTest" ]);
    grunt.registerTask("lint", [ "tslint" ]);
    grunt.registerTask("build", [ "ts" ]);
}
