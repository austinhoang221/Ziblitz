import Endpoint from "../app/api/endpoint";
import { axiosInstance } from "../app/middleware";
import { IResponse } from "../app/models/IResponse";
import { ISprint } from "../app/models/ISprint";

export class SprintService {
    public static createSprint = async (id: string) => {
        try {
        const response: IResponse<ISprint> = await axiosInstance.post(Endpoint.createSprint + id + '/sprints/:no-field');
        console.log('POST response:', response.data);
          return response;
        } catch (error) {
          console.error('Error making POST request:', error);
        }
      };
}