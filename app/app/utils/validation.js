export const validateField = (fieldName, value) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const nameRegex = /^[a-zA-Z]+$/;
  const hasSpaces = (value) => /\s/.test(value);

  switch (fieldName) {
    case "firstName":
      if (!value) return "Firstname is required";
      if (hasSpaces(value)) return "Firstname should not contain spaces";
      if (!nameRegex.test(value))
        return "Firstname should only contain letters";
      return "";
    case "lastName":
      if (!value) return "Lastname is required";
      if (hasSpaces(value)) return "Lastname should not contain spaces";
      if (!nameRegex.test(value)) return "Lastname should only contain letters";
      return "";
    case "email":
      if (!value) return "Email is required";
      if (hasSpaces(value)) return "Email should not contain spaces";
      if (!emailRegex.test(value)) return "Email is not valid";
      return "";
    case "username":
      if (!value) return "Username is required";
      if (hasSpaces(value)) return "Username should not contain spaces";
      if (value.length <= 3) return "Username must be more than 3 characters";
      return "";
    case "password":
      if (!value) return "Password is required";
      if (hasSpaces(value)) return "Password should not contain spaces";
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
