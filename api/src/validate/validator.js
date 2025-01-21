import Joi from "joi";

export const signUpSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Validate email format without restricting TLDs
    .required(),

  password: Joi.string().min(8).max(20).required(),
  name: Joi.string()
    .alphanum() // Only letters and numbers allowed
    .min(3)
    .max(30)
    .required(),

  role: Joi.string().valid("instructor", "student").required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      console.error(error.details[0].message);
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    if (!req.value) {
      req.value = {};
    }

    req.value["body"] = value;
    next();
  };
};
