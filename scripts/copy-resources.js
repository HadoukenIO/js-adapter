
const fs = require('fs');
const path = require('path');

function mkdir(dirPath) {
    try {
        fs.mkdirSync(dirPath);
    } catch (e) {
        if (!e.message.includes('file already exists')) {
            throw e;
        }
    }
}

function copyInstaller() {
    mkdir(path.join('out', 'resources'));
    mkdir(path.join('out', 'resources', 'win'));
    const rd = fs.createReadStream(path.join('resources', 'win', 'OpenFinInstaller.exe'));
    const outf = path.join('out', 'resources', 'win', 'OpenFinInstaller.exe');
    const wr = fs.createWriteStream(outf);
    rd.pipe(wr);
}

copyInstaller();
