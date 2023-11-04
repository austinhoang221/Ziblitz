import Endpoint from "../app/api/endpoint";
import { axiosInstance } from "../app/middleware";
import { IDetailProject } from "../app/models/IDetailProject";
import { IPaginateResponse } from "../app/models/IPaginateResponse";
import { IPriority } from "../app/models/IPriority";
import { IProject } from "../app/models/IProject";
import { IResponse } from "../app/models/IResponse";

export class ProjectService {
  public static getAll = async (
    id: string,
    pageNum: number,
    pageSize: number,
    sorts: string[],
    code?: string,
    name?: string
  ) => {
    let query: string = `?PageNum=${pageNum}&PageSize=${pageSize}`;
    query += code ? "&code=" + code : "";
    query += name ? "&name=" + name : "";
    if (sorts.length > 0) {
      query += "&sort=";
      sorts.forEach((sort, index) => {
        query += sort;
        if (index !== sorts.length - 1) query += ",";
      });
    }
    try {
      const response: IPaginateResponse<IProject[]> = await axiosInstance.get(
        Endpoint.getAllProject + id + "/projects" + query
      );
      console.log("POST response:", response.data.content);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static getByCode = async (userId: string, code: string) => {
    try {
      const response: IResponse<IDetailProject> = await axiosInstance.get(
        Endpoint.getProjectByCode + userId + "/projects/" + code
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static create = async (userId: string, payload: IProject) => {
    try {
      const response: IResponse<IProject> = await axiosInstance.post(
        Endpoint.createProject + userId + "/projects",
        payload
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static update = async (
    userId: string,
    payload: any,
    projectId: string
  ) => {
    try {
      const response: IResponse<IDetailProject> = await axiosInstance.put(
        Endpoint.updateProject + userId + "/projects/" + projectId,
        payload
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static delete = async (userId: string, projectId: string) => {
    try {
      const response: IResponse<IDetailProject> = await axiosInstance.delete(
        Endpoint.getPriorities + userId + "/projects/" + projectId
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static getPriorities = async (projectId: string) => {
    try {
      const response: IResponse<IPriority[]> = await axiosInstance.get(
        Endpoint.getPriorities + projectId + "/priorities"
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static addMember = async (userId: string, payload: any) => {
    try {
      const response: IResponse<IDetailProject> = await axiosInstance.post(
        Endpoint.deleteProject + userId + "/projects/members:add",
        payload
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };
}
