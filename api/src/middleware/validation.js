// Validation middleware using Zod
export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse(req.body);
      req.validatedData = validatedData;
      next();
    } catch (error) {
      console.log("Validation error:", error);

      if (error.issues && Array.isArray(error.issues)) {
        // Format Zod validation errors into user-friendly messages
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        return res.status(400).json({
          error: "Validation failed",
          details: formattedErrors,
        });
      }

      return res.status(400).json({
        error: "Invalid request data",
        message: error.message || "Request validation failed",
      });
    }
  };
};
