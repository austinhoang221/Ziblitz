import Endpoint from "../../app/api/endpoint";
import { IAuthentication } from "../../app/models/IAuthentication";
import { useQuery } from "react-query";
import axios from "axios";
export class AuthenticationService {
    public static logIn = async (payload: any) => {
        try {
          const response = await axios.post(Endpoint.loginUrl, payload);
          console.log('POST response:', response.data);
          // Handle the response data or any other logic here
        } catch (error) {
          console.error('Error making POST request:', error);
        }
      };

      public static signUp = async (payload: any) => {
        try {
          const response = await axios.post(Endpoint.signUpUrl, payload);
          console.log('POST response:', response.data);
          // Handle the response data or any other logic here
        } catch (error) {
          console.error('Error making POST request:', error);
        }
      };
}