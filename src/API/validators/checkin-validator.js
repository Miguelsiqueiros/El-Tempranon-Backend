const { check } = require("express-validator");

module.exports = [
  check("pin")
    .isNumeric()
    .isLength({ min: 4, max: 4 })
    .withMessage("Please enter a valid PIN")
    .notEmpty()
    .withMessage("Field pin is required")
];
