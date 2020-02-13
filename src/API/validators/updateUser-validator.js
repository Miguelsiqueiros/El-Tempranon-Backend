const { check } = require("express-validator");

module.exports = [
  check("pin")
    .isNumeric()
    .isLength({ min: 4, max: 4 })
    .withMessage("Please enter a valid PIN")
    .notEmpty()
    .withMessage("Field pin is required"),
  check("name")
    .isString()
    .withMessage("Name should only have letters.")
    .notEmpty()
    .withMessage("Field name is required"),
  check("arrival")
    .notEmpty()
    .withMessage("Field arrival is required")
    .isNumeric()
    .withMessage("Arrival hour must be a number")
];
