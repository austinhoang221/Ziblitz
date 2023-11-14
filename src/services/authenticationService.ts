import Endpoint from "../app/api/endpoint";
import { IAuthentication } from "../app/models/IAuthentication";
import { axiosInstance } from "../app/middleware";
import { IResponse } from "../app/models/IResponse";
export class AuthenticationService {
  public static logIn = async (payload: any) => {
    try {
      console.log(Endpoint.loginUrl);
      const response: IResponse<IAuthentication> = await axiosInstance.post(
        Endpoint.loginUrl,
        payload
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static signUp = async (payload: any) => {
    try {
      const response: IResponse<IAuthentication> = await axiosInstance.post(
        Endpoint.signUpUrl,
        payload
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };
}
