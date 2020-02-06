const { param } = require("express-validator");

module.exports = [
  param("weeks")
    .isInt()
    .withMessage("Number should be an Integer.")
    .notEmpty()
    .withMessage("Field week is required")
    .custom((result) => {
        return (result > 0 && result < 13) ? true : false 
    })
    .withMessage("Week should be 1 - 12 range.")
    
  
];