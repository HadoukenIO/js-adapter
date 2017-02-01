const path = require("path");
const testAppConfig = path.join("test","app.json");

module.exports = function(grunt) {

    grunt.initConfig({
        ts: {
            default: {
                tsconfig: true
            }
        },
        tslint: {
            default: {
                src: ["src/**/*.ts", "repl/*.ts", "test/*.ts"]
            },
            options: {
                configuration: "tslint.json"
            }
        },
        mochaTest: {
            default: {
                src: "out/test/**/*.js"
            }
        },
        openfin: {
            options: {
                open: true,
                configPath: path.resolve(testAppConfig)
            },
            launch: {
                open:true
            }
        }
    });

    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-tslint");
    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.loadNpmTasks('grunt-openfin');

    grunt.registerTask("default", [ "lint", "build" ]);
    grunt.registerTask("test", [ "default", "openfin", "mochaTest" ]);
    grunt.registerTask("lint", [ "tslint" ]);
    grunt.registerTask("build", [ "ts" ]);
};
