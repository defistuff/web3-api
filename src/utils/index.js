const { log } = require('console');
const { readdirSync } = require('fs');
const path = require('path');

function camelCase(input) {
    return input.toLowerCase().replace(/-(.)/g, function (match, group1) {
        return group1.toUpperCase();
    });
}

function getModules() {
    const _path = path.resolve(__dirname, '..');
    const modules = readdirSync(_path + '/modules').map(function (dirContent) {
        const module = require(_path + '/modules/' + dirContent);
        console.log(module);
        return {
            module: dirContent,
            methods: module.methods,
        };
    });

    return modules;
}

console.log(getModules());

module.exports = {
    camelCase,
    getModules,
};
