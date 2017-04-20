const path = require("path");
const testAppConfig = path.join("test","app.json");

module.exports = function(grunt) {
    const version = grunt.option("ver");
    const uuid = "testapp";
    const url = "about:blank";
    const args = "--v=1 --enable-logging --enable-multi-runtime";
    
    grunt.initConfig({
        ts: {
            default: {
                tsconfig: true
            }
        },
        tslint: {
            default: {
                src: [ "src/**/*.ts", "repl/*.ts", "test/*.ts" ]
            },
            options: {
                configuration: "tslint.json"
            }
        },
        mochaTest: {
            default: {
                src: "out/test/**/multi-runtime.test.js"
            }
        },
        openfin: {
            options: {
                open: true,
                configPath: path.resolve(testAppConfig),
                config: {
                    filePath: path.resolve(testAppConfig),
                    create: true,
                    options: {
                        runtime: {
                            arguments: args,
                            version
                        },
                        startup_app: {
                            uuid,
                            autoShow: false,
                            url,
                            nonPersistent: true,
                            saveWindowState: false
                        }
                    }
                }
            },
            launch: {
                open: true
            }
        }
    });

    grunt.registerTask("check-version", function() {
        if (!version) {
            grunt.fail.fatal("No version given, please provide a target version");
        }
    });
    
    grunt.registerTask('start-repl', function() {
        const finRepl = require(`./out/repl/index.js`);
        const done = this.async();
        finRepl.startRepl();
    });
    
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-tslint");
    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.loadNpmTasks('grunt-openfin');
    
    grunt.registerTask("lint", [ "tslint" ]);
    grunt.registerTask("build", [ "ts" ]);
    grunt.registerTask("default", [ "lint", "build" ]);
    grunt.registerTask("test", [ "check-version", "default", "openfin", "mochaTest" ]);
    grunt.registerTask("repl", [ "check-version", "default", "openfin", "start-repl" ]);
};
