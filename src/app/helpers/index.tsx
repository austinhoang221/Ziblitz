import { blue, green, orange, red, yellow } from "@ant-design/colors";
import { IResponse } from "../models/IResponse";
import Message from "../pages/components/message";

export const sasToken =
  "?sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2024-11-12T10:35:35Z&st=2023-12-11T02:35:35Z&spr=https,http&sig=wpS08Fr4qcC%2FjL2BqJtKhD7JgYTnc%2FvrpcRu2%2BC0mBM%3D";

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
  if (name) {
    const words = name.split(" ");
    const initials = words
      .map((word: string) => word.charAt(0).toUpperCase())
      .join("");
    return initials;
  }
};

export const byteToMb = (kilobytes: number) => {
  const megabytes = kilobytes / (1024 * 1024);
  return megabytes.toFixed(2); // Limiting to two decimal places
};

export const getRandomColor = () => {
  const r = Math.floor(Math.random() * 256); // Random value between 0 and 255 for red
  const g = Math.floor(Math.random() * 256); // Random value between 0 and 255 for green
  const b = Math.floor(Math.random() * 256); // Random value between 0 and 255 for blue

  // Convert RGB values to a hexadecimal color code
  const hexColor = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;

  return hexColor;
};

export const getFileIcon = (type: string) => {
  switch (type) {
    case "video/mp4":
      return (
        <i className="fa-solid fa-video" style={{ color: yellow.primary }}></i>
      );

    case "image/jpeg":
    case "image/png":
      return (
        <i className="fa-regular fa-image" style={{ color: orange[2] }}></i>
      );

    case "application/pdf":
      return (
        <i className="fa-regular fa-file-pdf" style={{ color: red[2] }}></i>
      );

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.template":
      return (
        <i className="fa-regular fa-file-word" style={{ color: blue[2] }}></i>
      );

    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    case "application/vnd.ms-excel":
      return (
        <i className="fa-regular fa-file-excel" style={{ color: green[2] }}></i>
      );

    case "application/rtf":
      return "rtf-icon.png";

    // Add more cases for other file types as needed

    default:
      return <i className="fa-regular fa-file"></i>;
  }
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
