const path = require('path');
const testAppConfig = path.join('test','app.json');
const liveServer = require('live-server');

const serverParams = {
    root: path.resolve('html'),
    open: false,
    logLevel: 2,
    port: 8689
};

module.exports = function(grunt) {
    const version = grunt.option('ver');
    const uuid = 'testapp';
    const args = '--v=1 --enable-logging --enable-multi-runtime';
    
    grunt.initConfig({
        ts: {
            default: {
                tsconfig: true
            }
        },
        tslint: {
            default: {
                src: [ 'src/**/*.ts', 'repl/*.ts', 'test/*.ts' ]
            },
            options: {
                configuration: grunt.file.readJSON('tslint.json'),
                rulesDirectory: 'node_modules/tslint-microsoft-contrib',
                force: false
            }
        },
        mochaTest: {
            default: {
                src: 'out/test/**/*.js'
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
                            autoShow: true,
                            url: `http://localhost:${serverParams.port}/index.html`,
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

    grunt.registerTask('check-version', function() {
        if (!version) {
            grunt.fail.fatal('No version given, please provide a target version');
        }
    });

    grunt.registerTask('start-server', function() {
        const done = this.async();
        liveServer.start(serverParams).on('listening', done);
    });
    
    grunt.registerTask('start-repl', function() {
        const finRepl = require(`./out/repl/index.js`);
        const done = this.async();
        finRepl.startRepl();
    });
    
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-tslint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-openfin');
    
    grunt.registerTask('lint', [ 'tslint' ]);
    grunt.registerTask('build', [ 'ts' ]);
    grunt.registerTask('default', [ 'lint', 'build' ]);
    grunt.registerTask('test', [ 'check-version', 'default', 'start-server', 'openfin', 'mochaTest' ]);
    grunt.registerTask('repl', [ 'check-version', 'default', 'start-server', 'openfin', 'start-repl' ]);
};
