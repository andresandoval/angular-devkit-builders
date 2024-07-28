const fs = require('fs');
var copyfiles = require('copyfiles');


// copy package json without "dev data" to dist folder
const packageRaw = fs.readFileSync('package.json');
const packageJson = JSON.parse(packageRaw);

packageJson['main'] = 'index.js';
packageJson['types'] = 'index.d.ts';
delete packageJson['scripts'];
delete packageJson['devDependencies'];
delete packageJson['files'];
fs.writeFileSync('dist/package.json', JSON.stringify(packageJson, null, 2));

// copy all json files to dist folder
copyfiles(['builders.json', './dist'], {}, err => {
    if (!!err) {
        throw new Error('Error copying the builder json file');
    }
});
copyfiles(['./src/**/*.json', './dist'], {up: 1}, err => {
    if (!!err) {
        throw new Error('Error copying schema.json files');
    }
})