// validation.js

export const validateEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return emailPattern.test(email);
};

export const validateRegisterFields = (username, email, password) => {
  const errors = {};

  if (!username) {
    errors.username = "Username is required.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!validateEmail(email)) {
    errors.email = "Invalid email format.";
  }

  if (!password) {
    errors.password = "Password is required.";
  }

  return errors;
};

//
export const validateLoginFields = (email, password) => {
  const validationErrors = {};
  const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  if (!email) {
    validationErrors.email = "Email is required.";
  } else if (!emailPattern.test(email)) {
    validationErrors.email = "Please enter valid email";
  }

  if (!password) {
    validationErrors.password = "Password is required.";
  }

  return validationErrors;
};

export const validateCreateNewTicketFields = (
  title,
  description,
  department
) => {
  const validationErrors = {};
  if (!title) {
    validationErrors.title = "Title is required.";
  }
  if (!description) {
    validationErrors.description = "Description is required.";
  }
  if (!department) {
    validationErrors.department = "Department is required.";
  }
  return validationErrors;
};
