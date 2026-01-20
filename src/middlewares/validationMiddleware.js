export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    // For params, try to convert numeric strings to numbers
    let dataToValidate = req[source];
    if (source === "params" && typeof dataToValidate === "object") {
      dataToValidate = Object.keys(dataToValidate).reduce((acc, key) => {
        const val = dataToValidate[key];
        // Try to parse as number if it looks like a number
        acc[key] = !isNaN(val) && val !== "" ? Number(val) : val;
        return acc;
      }, {});
    }

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }

    // Replace the request object with validated data
    req[source] = value;
    next();
  };
};
