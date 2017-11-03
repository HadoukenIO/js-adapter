const path = require('path');
const testAppConfig = path.join('test','app.json');
const liveServer = require('live-server');
const ps = require('ps-node');
const exec = require('child_process').exec;
const rimraf = require('rimraf');
const webpack = require('webpack');
const asar = require('asar');

const stagingDir = path.resolve('staging');
const outDir = path.resolve('out');
const webpackConfig = {
    entry: './out/src/of-main.js',
    output: {
        filename: './staging/js-adapter.js'
  }
};
const serverParams = {
    root: path.resolve('html'),
    open: false,
    logLevel: 0,
    port: 8689
};

module.exports = function(grunt) {
    const asarName = 'js-adapter.asar';
    const version = grunt.option('ver');
    const remote = grunt.option('remote');
    const uuid = 'testapp';
    const args = '--enable-multi-runtime';

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
        },
        copy: {
            resources: {
                files: [
                    { src: 'resources/**', dest: 'out/' }
                ]
            }
        }
    });

    grunt.registerTask('check-version', function() {
        if (!version) {
            grunt.fail.fatal('No version given, please provide a target version');
        }
    });

    grunt.registerTask('clean', function() {

        rimraf.sync(outDir);
        grunt.log.ok('out directory deleted');
    });

    grunt.registerTask('start-server', function() {
        const done = this.async();
        liveServer.start(serverParams).on('listening', done);
    });

    grunt.registerTask('start-repl', function() {
        const finRepl = require(path.join(outDir, 'repl', 'index.js'));
        const done = this.async();
        finRepl.startRepl();
    });

    grunt.registerTask('asar', function() {
        const done = this.async();

        asar.createPackage(stagingDir, path.join(outDir, asarName), function(err) {
            if (err) {
                grunt.log.error(err.message);
            } else {
                grunt.log.ok('package created');
            }
            rimraf.sync(stagingDir);
            grunt.log.ok('staging directory deleted');
            done();
        });
    });

    grunt.registerTask('webpack', function() {
        const done = this.async();
        webpack(webpackConfig, (err, stats) => {
            if (err || stats.hasErrors()) {
                const error = err ? err.message: "webpack error";
                grunt.log.error(error);
                done(err);
            } else {
                grunt.log.ok('webpack task done');
                done();
            }
        });

    });

    grunt.registerTask('kill-processes', function() {
          ps.lookup({
              command: 'openfin.exe'
          }, (err, processList) => {
              if (err) {
                  throw new Error(err);
              }
              processList.forEach(i=> ps.kill(i.pid));
          });
    });

    grunt.registerTask('publish-docs', () => {
        exec(`cd docs && git commit -am "committed new update for node-adapter documentation." && git push ${ remote } master`, function(err, stdout, stderr) {
             if (err) {
                 grunt.log.error(err);
             } else {
                 grunt.log.ok('published new documentationfor node-adapter.');
             }
        });
    });

    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-tslint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-openfin');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('lint', [ 'tslint' ]);
    grunt.registerTask('build', [ 'clean', 'ts', 'webpack', 'asar', 'copy:resources' ]);
    grunt.registerTask('default', [ 'lint', 'build' ]);
    grunt.registerTask('test', [ 'check-version', 'default', 'start-server', 'kill-processes', 'openfin', 'mochaTest', 'kill-processes']);
    grunt.registerTask('repl', [ 'check-version', 'default', 'start-server', 'openfin', 'start-repl' ]);

};
