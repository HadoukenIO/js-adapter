const path = require('path');
const manifestPath = path.resolve('test', 'app.json');
const httpServer = require('http-server');
const ps = require('ps-node');
const os = require('os');
const { exec } = require('child_process');
const webpack = require('webpack');
const { buildCore, resolveRuntimeVersion } = require('./coreUtils');

const outDir = path.resolve('out');
const webpackConfig = {
    entry: './out/src/of-main.js',
    output: {
        filename: './out/js-adapter.js'
    }
};
const serverParams = {
    root: path.resolve('html'),
    open: false,
    logLevel: 0,
    port: 8689,
    ignore: path.resolve('html')
};


module.exports = function (grunt) {
    const version = grunt.option('ver');
    const corePath = grunt.option('core');
    const remote = grunt.option('remote');
    const rvmDir = grunt.option('rvmDir');
    const target = grunt.option('target');
    const uuid = 'testapp';
    const args = '--enable-multi-runtime --debug=5858';
    process.env.OF_VER = version;
    process.env.TEST_SERVER_PORT = serverParams.port;

    process.env.RVM_DIR = rvmDir || path.resolve('' + process.env.localAppData, 'OpenFin');

    grunt.initConfig({
        shell: {
            build: {
                command: 'tsc',
                preferLocal: true
            }
        },
        tslint: {
            default: {
                src: ['src/**/*.ts', 'repl/*.ts', 'test/*.ts']
            },
            options: {
                configuration: grunt.file.readJSON('tslint.json'),
                rulesDirectory: 'node_modules/tslint-microsoft-contrib',
                force: false
            }
        },
        mochaTest: {
            default: {
                src: 'out/test/**/*.js',
                timeout: 30000
            }
        },
        copy: {
            resources: {
                files: [{ src: 'resources/**', dest: 'out/' }]
            }
        }
    });

    grunt.registerTask('check-version', function () {
        if (!version) {
            grunt.fail.fatal('No version given, please provide a target version');
        }
    });

    grunt.registerTask('clean', function () {
        grunt.file.delete(outDir);
        grunt.log.ok('out directory deleted');
    });

    grunt.registerTask('start-server', function () {
        const server = httpServer.createServer(serverParams);
        server.listen(serverParams.port);
    });

    grunt.registerTask('start-repl', function () {
        const finRepl = require(path.join(outDir, 'repl', 'index.js'));
        const done = this.async();
        finRepl.startRepl();
    });

    grunt.registerTask('deploy', function () {
        if (!target) {
            grunt.log.writeln('no deploy target specified, skipping deploy step');
        } else {
            const deployPath = path.join(target, 'js-adapter', 'js-adapter.js');
            grunt.file.copy(webpackConfig.output.filename, deployPath);
            grunt.log.ok(`deployed to ${deployPath}`);
        }
    });

    //using the node webpack API: https://webpack.js.org/api/node/
    //will use Task Error or Warning grunt codes based on webpack results: https://gruntjs.com/exit-codes
    grunt.registerTask('webpack', function () {
        const done = this.async();
        webpack(webpackConfig, (err, stats) => {
            if (err) {
                const error = err ? err.message : 'webpack error';
                if (err.details) {
                    grunt.fail.fatal(err.details, 3);
                }
            } else if (stats.hasErrors()) {
                const info = stats.toJson();
                grunt.fail.fatal(info.errors, 3);
            } else if (stats.hasWarnings()) {
                const info = stats.toJson();
                grunt.fail.warn(info.warnings, 6);
            } else {
                grunt.log.ok('webpack task done');
                done();
            }
        });
    });

    grunt.registerTask('kill-processes', function () {
        ps.lookup({
            command: 'openfin.exe'
        },
            (err, processList) => {
                if (err) {
                    throw new Error(err);
                }
                processList.forEach(i => ps.kill(i.pid));
            }
        );
    });

    grunt.registerTask('publish-docs', () => {
        exec(`cd docs && git commit -am "committed new update for node-adapter documentation." && git push ${remote} master`,
            function (err, stdout, stderr) {
                if (err) {
                    grunt.log.error(err);
                } else {
                    grunt.log.ok(
                        'published new documentation for node-adapter.'
                    );
                }
            }
        );
    });

    grunt.registerTask('launch-openfin', function () {
        const { launch } = require(path.join(outDir, 'src', 'main.js'));
        const done = this.async();

        launch({
            manifestUrl: manifestPath
        }).then(done).catch(done);

    });

    grunt.registerTask('update-manifest', function () {
        const manifest = {
            runtime: {
                arguments: args,
                version
            },
            startup_app: {
                uuid,
                autoShow: true,
                url: `http://localhost:${serverParams.port}/index.html`,
                nonPersistent: true,
                saveWindowState: false,
                experimental: {
                    v2Api: true
                }
            }
        };

        grunt.file.write(manifestPath, JSON.stringify(manifest));
    });

    grunt.registerTask('core', function () {
        if (version) {
            let done = this.async();
            resolveRuntimeVersion(version).then(v => {
                if (process.platform === 'win32') {
                    // Windows
                    if (!grunt.file.exists(`${process.env.localAppData}/OpenFin/runtime/${v}`)) {
                        grunt.log.error('WARNING: The specified version of runtime does not exist. The core wil not be deployed.');
                    } else {
                        buildCore(corePath || '', `${process.env.localAppData}/OpenFin/runtime/${v}/OpenFin/resources`);
                    }
                } else {
                    // *nix system
                    // TODO deploy to appropriate directory
                    grunt.log.error('WARNING: Core deployment on ' + process.platform + ' is not supported. Core wil not be deployed.');
                }
                done();
            });
        } else {
            buildCore(corePath || '');
        }
    });

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-tslint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('lint', ['tslint']);

    grunt.registerTask('openfin', ['update-manifest', 'launch-openfin']);
    grunt.registerTask('build', [
        'clean',
        'shell',
        'webpack',
        'copy:resources'
    ]);

    grunt.registerTask('default', [
        'lint',
        'build',
        'deploy'
    ]);

    grunt.registerTask('test', [
        'check-version',
        'core',
        'default',
        'start-server',
        'openfin',
        'mochaTest',
        'kill-processes'
    ]);

    grunt.registerTask('repl', [
        'check-version',
        'default',
        'start-server',
        'openfin',
        'start-repl'
    ]);

};
