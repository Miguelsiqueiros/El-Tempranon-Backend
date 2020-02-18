const { param } = require("express-validator");

module.exports = [
  param("pin")
  .isInt({gt: 0})
  .withMessage("Number should be an Integer & not negative.")
  .isLength({ min: 4, max: 4 })
  .withMessage("Please enter a valid PIN should be 4 numbers.")
  .notEmpty()
  .withMessage("Field pin is required")
];