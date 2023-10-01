import Endpoint from "../app/api/endpoint";
import axios, { AxiosResponse } from "axios";
import { IAuthentication } from "../app/models/IAuthentication";
import { axiosInstance } from "../app/middleware";
export class AuthenticationService {
    public static logIn = async (payload: any) => {
        try {
        const response: AxiosResponse<IAuthentication> = await axiosInstance.post(Endpoint.loginUrl, payload);
        console.log('POST response:', response.data);
          return response;
        } catch (error) {
          console.error('Error making POST request:', error);
        }
      };

      public static signUp = async (payload: any) => {
        try {
          const response: AxiosResponse<IAuthentication>  = await axiosInstance.post(Endpoint.signUpUrl, payload);
          console.log('POST response:', response.data);
          return response;
        } catch (error) {
          console.error('Error making POST request:', error);
        }
      };
}