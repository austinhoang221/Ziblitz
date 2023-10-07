import Endpoint from "../app/api/endpoint";
import { axiosInstance } from "../app/middleware";
import { IPaginateResponse } from "../app/models/IPaginateResponse";
import { IProject } from "../app/models/IProject";
import { IResponse } from "../app/models/IResponse";

export class ProjectService {
    public static getAll = async (id: string, pageNum: number, pageSize: number, sorts: string[], code?: string, name?: string) => {
        let query: string = `?PageNum=${pageNum}&PageSize=${pageSize}`;
        query += code ? "&code=" + code : "";
        query += name ? "&name=" + name : "";
        if(sorts.length > 0){
          query += "&sort="
          sorts.forEach((sort, index) => {
            query += sort
            if(index !== sorts.length - 1) query += ',';
          })
        }
        try {
        const response: IPaginateResponse<IProject[]> = await axiosInstance.get(Endpoint.getAllProject + id + '/projects' + query);
        console.log('POST response:', response.data.content);
          return response;
        } catch (error) {
          console.error('Error making POST request:', error);
        }
      };

      public static getByCode = async (id: string, code: string) => {
        try {
        const response: IResponse<IProject> = await axiosInstance.get(Endpoint.getProjectByCode + id + '/projects/' + code);
        console.log('POST response:', response.data);
          return response;
        } catch (error) {
          console.error('Error making POST request:', error);
        }
      };
    
        public static create = async (id: string, payload: IProject) => {
            try {
            const response: IResponse<IProject> = await axiosInstance.post(Endpoint.createProject + id + '/projects', payload);
            console.log('POST response:', response.data);
              return response;
            } catch (error) {
              console.error('Error making POST request:', error);
            }
          };
    
          public static update = async (id: string, payload: any, projectId: string) => {
            try {
            const response: IResponse<IProject> = await axiosInstance.put(Endpoint.updateProject + id + '/projects/' + projectId, payload);
            console.log('POST response:', response.data);
              return response;
            } catch (error) {
              console.error('Error making POST request:', error);
            }
          };
    
          public static delete = async (id: string, projectId: string) => {
            try {
            const response: IResponse<IProject> = await axiosInstance.delete(Endpoint.deleteProject + id + '/projects/' + projectId);
            console.log('POST response:', response.data);
              return response;
            } catch (error) {
              console.error('Error making POST request:', error);
            }
          };
}