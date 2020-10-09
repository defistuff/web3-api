const Ethereum = require('../modules/ethereum');

const SCHEMAS = {
    SEND_RAW_TRANSACTION: {
        addressFrom: 'address',
        addressTo: 'address',
        privKey: 'string',
        amount: 'string',
    },
};

const validations = {
    string: validateString,
    number: validateNumber,
    address: validateAddress,
};

function validateRequest(data, schema) {
    let validation = {};

    if (Object.keys(data).length === 0) {
        validation.validations = [];
        validation.isValid = false;
        return validation;
    }

    const toBeValidated = SCHEMAS[schema];
    let fields = Object.keys(data).map((key) => {
        const field = toBeValidated[key];
        if (field) {
            const validator = validations[field];
            return { field, isValid: validator(data[key]) };
        } else {
            return { field: key, isValid: false };
        }
    });
    validation.validations = fields;
    validation.isValid = fields.every((x) => x.isValid);

    return validation;
}

function validateString(str) {
    return typeof str === 'string' && str !== '';
}

function validateNumber(str) {
    return typeof str === 'number';
}

function validateAddress(addr) {
    return Ethereum.misc._validateAddress(addr);
}

module.exports = { validateRequest };
