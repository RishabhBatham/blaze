const Joi = require('joi');

// User Signup Validation Schema
const signupValidation = (req, res, next) => {
  const schema = Joi.object({
  /*   firstname: Joi.string().min(2).required(), */
   /*  email: Joi.string().email().required(), */
  
  /*   mobile: Joi.string().pattern(/^[0-9]{10}$/).required(), */
  /*   password: Joi.string().min(6).required() */
  });

  const { error } = schema.validate(req.body);
   


  if (error) {
   
    return res.status(400).json({status:false, message: error.details[0].message });
  }

  next();
};

module.exports = { signupValidation };