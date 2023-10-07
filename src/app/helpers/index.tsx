import { IResponse } from "../models/IResponse";
import Message from "../pages/components/message";

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
  const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[#?!@$%^&*-]).{8,}$/;
  if (!value || value.match(passwordRegex)) {
    // If the value is empty or matches the regex, it's valid
    callback();
  } else {
    // If the value doesn't match the regex, provide an error message
    callback("Please enter a valid password");
  }
};

export const convertNameToInitials = (name: string) => {
  const words = name.split(" ");
  const initials = words
    .map((word: string) => word.charAt(0).toUpperCase())
    .join("");
  return initials;
};

export const getRandomColor = () => {
  const r = Math.floor(Math.random() * 256); // Random value between 0 and 255 for red
  const g = Math.floor(Math.random() * 256); // Random value between 0 and 255 for green
  const b = Math.floor(Math.random() * 256); // Random value between 0 and 255 for blue

  // Convert RGB values to a hexadecimal color code
  const hexColor = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;

  return hexColor;
};

export function checkResponseStatus<T>(response: IResponse<T> | undefined) {
  if (
    response &&
    response?.data &&
    response?.statusCode >= 200 &&
    response?.statusCode < 400
  ) {
    return true;
  }
  return false;
}

export const showMessage = (type: "success" | "error", content: string) => {
  Message({ type: type, content: content });
};
