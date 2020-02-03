const { check } = require('express-validator');

module.exports = [
  check('name')
    .isString()
    .withMessage('Name should only have letters')
    .notEmpty()
    .withMessage('Field name is required'),
  check('email')
    .isEmail()
    .withMessage('Email format is incorrect')
    .notEmpty()
    .withMessage('Field email is required')
];
