function camelCase(input) {
    return input.toLowerCase().replace(/-(.)/g, function (match, group1) {
        return group1.toUpperCase();
    });
}

module.exports = {
    camelCase,
};
