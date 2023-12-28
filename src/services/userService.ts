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

  public static update = async (userId: string, payload: any) => {
    try {
      const response: IResponse<IUser> = await axiosInstance.put(
        Endpoint.getAllUser + userId,
        payload
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static changePassword = async (userId: string, payload: any) => {
    try {
      const response: IResponse<IUser> = await axiosInstance.put(
        Endpoint.getAllUser + userId + "/change-password",
        payload
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static uploadImage = async (userId: string) => {
    try {
      const response: IResponse<IUser> = await axiosInstance.post(
        Endpoint.getAllUser + userId + "/photos"
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };
}
