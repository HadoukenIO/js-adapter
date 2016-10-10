const { task, rule, directory, exec, complete } = require("jake"),
    jake = require("jake"), 
    path = require("path"),
    OUT_DIR = "out",
    execOpts = { printStdout: true, printStderr: true },
    async = { async: true }

task("typescript", [ OUT_DIR, `${OUT_DIR}/main.js` ])
task("default", [ "tsc" ])

task("test", [ "default" ], async, function() {
    exec(npmBin("mocha"), execOpts, complete)
})

task("clean", function() {
    jake.rmRf(OUT_DIR)
    jake.rmRf("test/mock")
})

directory(OUT_DIR)

function npmBin(cmd) {
    // Use `npm bin`?
    return path.join("node_modules", ".bin", cmd)
}

rule(`${OUT_DIR}/%.js`, srcName, async, function() {
    exec(`${npmBin("tsc")} ${this.source}`, execOpts, complete) // --outDir ${OUT_DIR} !
})

task("tsc", [ OUT_DIR ], async, function() {
    exec(npmBin("tsc"), Object.assign({}, execOpts, { breakOnError: false }), complete) 
})

function srcName(name) {
    return path.join(path.dirname(name), "..", "src", path.basename(name.replace(".js", ".ts")))
}