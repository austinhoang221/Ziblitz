import { AxiosResponse } from "axios";
import Endpoint from "../app/api/endpoint";
import { axiosInstance } from "../app/middleware";
import { IProject } from "../app/models/IProject";
import { IResponse } from "../app/models/IResponse";

export class ProjectService {
    public static getAllProject = async (id: string, pageNum: number, pageSize: number, code?: string, name?: string) => {
        let query: string = `?PageNum=${pageNum}&PageSize=${pageSize}`;
        query += code ? "&code=" + code : "";
        query += name ? "&name=" + name : "";
        try {
        const response: IResponse<IProject[]> = await axiosInstance.get(Endpoint.getAllProject + id + '/projects' + query);
        console.log('POST response:', response.data);
          return response;
        } catch (error) {
          console.error('Error making POST request:', error);
        }
      };
    
        public static createProject = async (id: string, payload: IProject) => {
            try {
            const response: AxiosResponse<IProject> = await axiosInstance.post(Endpoint.createProject + '/' + id + 'projects', payload);
            console.log('POST response:', response.data);
              return response;
            } catch (error) {
              console.error('Error making POST request:', error);
            }
          };
    
          public static updateProject = async (id: string, payload: IProject, projectId: string) => {
            try {
            const response: AxiosResponse<IProject> = await axiosInstance.post(Endpoint.updateProject + '/' + id + 'projects/' + projectId, payload);
            console.log('POST response:', response.data);
              return response;
            } catch (error) {
              console.error('Error making POST request:', error);
            }
          };
    
          public static deleteProject = async (id: string, payload: IProject, projectId: string) => {
            try {
            const response: AxiosResponse<IProject> = await axiosInstance.post(Endpoint.deleteProject + '/' + id + 'projects/' + projectId, payload);
            console.log('POST response:', response.data);
              return response;
            } catch (error) {
              console.error('Error making POST request:', error);
            }
          };
}