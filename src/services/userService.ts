import { AxiosResponse } from "axios";
import Endpoint from "../app/api/endpoint";
import { axiosInstance } from "../app/middleware";
import { IProject } from "../app/models/IProject";
import { IUser } from "../app/models/IUser";

export class UserService {
    public static createProject = async (id: string, payload: IProject) => {
        try {
        const response: AxiosResponse<IUser> = await axiosInstance.post(Endpoint.createProject + '/' + id + 'projects', payload);
        console.log('POST response:', response.data);
          return response;
        } catch (error) {
          console.error('Error making POST request:', error);
        }
      };

      public static updateProject = async (id: string, payload: IProject, projectId: string) => {
        try {
        const response: AxiosResponse<IUser> = await axiosInstance.post(Endpoint.updateProject + '/' + id + 'projects/' + projectId, payload);
        console.log('POST response:', response.data);
          return response;
        } catch (error) {
          console.error('Error making POST request:', error);
        }
      };

      public static deleteProject = async (id: string, payload: IProject, projectId: string) => {
        try {
        const response: AxiosResponse<IUser> = await axiosInstance.post(Endpoint.deleteProject + '/' + id + 'projects/' + projectId, payload);
        console.log('POST response:', response.data);
          return response;
        } catch (error) {
          console.error('Error making POST request:', error);
        }
      };
    }

    