import { AxiosResponse } from "axios";
import Endpoint from "../app/api/endpoint";
import { axiosInstance } from "../app/middleware";
import { IResponse } from "../app/models/IResponse";
import { IUser } from "../app/models/IUser";

export class RoleService {
    public static getAll = async () => {
        try {
        const response: IResponse<IUser[]> = await axiosInstance.get(Endpoint.getAllRole);
        console.log('POST response:', response.data);
          return response;
        } catch (error) {
          console.error('Error making POST request:', error);
        }
      };
    }

    