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
  password: Joi.string().required(),
});

export const addCourse = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().min(10).required(),
  imageUrl: Joi.string().required(),
  price: Joi.number().optional(),
});
export const addLecture = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().min(10).required(),
  videoUrl: Joi.string().required(),
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
