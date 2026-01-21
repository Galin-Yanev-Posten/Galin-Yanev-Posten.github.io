export function validateSignUp(formData) {
  if (
    !formData.firstName ||
    !formData.lastName ||
    !formData.email ||
    !formData.password
  ) {
    return "All fields are required";
  }

  if (formData.email !== formData.confirmEmail) {
    return "Emails do not match";
  }

  if (formData.password !== formData.confirmPassword) {
    return "Passwords do not match";
  }

  if (formData.password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return "";
}

export function validateProfile(formData) {
  if (!formData.firstName || !formData.lastName || !formData.email) {
    return "All fields are required";
  }

  return "";
}
