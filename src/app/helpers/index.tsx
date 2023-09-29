export const validateEmail = (rule: any, value: any, callback: any) => {
  // Define a custom regular expression for email validation
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (!value || value.match(emailRegex)) {
    // If the value is empty or matches the regex, it's valid
    callback();
  } else {
    // If the value doesn't match the regex, provide an error message
    callback("Please enter a valid email address");
  }
};


export const validatePassword = (rule: any, value: any, callback: any) => {
  const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  if (!value || value.match(passwordRegex)) {
    // If the value is empty or matches the regex, it's valid
    callback();
  } else {
    // If the value doesn't match the regex, provide an error message
    callback("The new password that you entered do not match");
  }
}