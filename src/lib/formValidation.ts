export const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/;

export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@\$%\^&\*])(?=.{8,})/;

export const PASSWORD_ERROR_MESSAGE =
  "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character.";

export const PHONE_ERROR_MESSAGE = "Please enter 10 digit number";

export const trimValue = (value: unknown) =>
  typeof value === "string" ? value.trim() : value;

export const validateEmail = (value: string, emptyMessage = "Email id cannot be empty") => {
  const trimmedValue = value?.trim?.() ?? "";

  if (!trimmedValue) {
    return emptyMessage;
  }

  return EMAIL_REGEX.test(trimmedValue) ? true : "Please Enter Valid Email id";
};

export const validatePassword = (
  value: string,
  emptyMessage = "Password cannot be empty",
  invalidMessage = PASSWORD_ERROR_MESSAGE
) => {
  if (!value) {
    return emptyMessage;
  }

  return PASSWORD_REGEX.test(value) ? true : invalidMessage;
};

export const validateConfirmPassword = (
  value: string,
  password: string,
  emptyMessage = "Confirm password cannot be empty"
) => {
  const passwordValidation = validatePassword(value, emptyMessage);

  if (passwordValidation !== true) {
    return passwordValidation;
  }

  return value === password ? true : "Your password and confirm password do not match.";
};

export const validatePhoneNumber = (
  number: string | number,
  emptyMessage = "Phone Number cannot be empty",
  invalidMessage = PHONE_ERROR_MESSAGE
) => {
  const normalizedNumber = number?.toString?.() ?? "";

  if (!normalizedNumber) {
    return emptyMessage;
  }

  return normalizedNumber.length === 10 ? true : invalidMessage;
};

export const validateRequiredText = (value: string, label: string) =>
  value?.trim?.() ? true : `${label} cannot be empty`;
