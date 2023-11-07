import Endpoint from "../app/api/endpoint";
import { axiosInstance } from "../app/middleware";
import { IResponse } from "../app/models/IResponse";
import { IUser } from "../app/models/IUser";

export class UserService {
  public static getAllUser = async (name?: string) => {
    const query = name ? "?Name=" + name : "";
    try {
      const response: IResponse<IUser[]> = await axiosInstance.get(
        Endpoint.getAllUser + query
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };
}
