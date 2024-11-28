export const validateField = (fieldName, value) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  switch (fieldName) {
    case "firstName":
      return value ? "" : "Firstname is required";
    case "lastName":
      return value ? "" : "Lastname is required";
    case "email":
      if (!value) return "Email is required";
      if (!emailRegex.test(value)) return "Email is not valid";
      return "";
    case "username":
      return value ? "" : "Username is required";
    case "password":
      if (!value) return "Password is required";
      if (!passwordRegex.test(value)) {
        return "Password must be at least 8 characters long, contain uppercase, lowercase, a number, and a special character";
      }
      return "";
    default:
      return "";
  }
};

export const isValidate = (data) => {
  let isValid = true;
  let tempErrors = {};

  for (const key in data) {
    const error = validateField(key, data[key]);
    if (error) {
      tempErrors[key] = error;
      isValid = false;
    }
  }

  return { isValid, errors: tempErrors };
};
