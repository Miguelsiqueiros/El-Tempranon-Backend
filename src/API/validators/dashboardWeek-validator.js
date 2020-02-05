const { param } = require("express-validator");

module.exports = [
  param("week")
    .isInt()
    .withMessage("Number should be an Integer.")
    .notEmpty()
    .withMessage("Field week is required")
    .custom((result) => {
        return (result > 0 && result < 53) ? true : false 
    })
    .withMessage("Week should be 1 - 52 range.")
    
  
];