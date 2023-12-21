import Endpoint from "../app/api/endpoint";
import { axiosInstance } from "../app/middleware";
import { IPaginateResponse } from "../app/models/IPaginateResponse";
import { IResponse } from "../app/models/IResponse";
import { IStatus } from "../app/models/IStatus";

export class StatusService {
  public static getAll = async (
    projectId: string,
    pageNum: number,
    pageSize: number,
    sorts: string[]
  ) => {
    let query: string = `?PageNum=${pageNum}&PageSize=${pageSize}`;
    if (sorts.length > 0) {
      query += "&sort=";
      sorts.forEach((sort, index) => {
        query += sort;
        if (index !== sorts.length - 1) query += ",";
      });
    }
    try {
      const response: IPaginateResponse<IStatus[]> = await axiosInstance.get(
        Endpoint.getStatus + projectId + "/statuses" + query
      );
      console.log("POST response:", response.data.content);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static getCategories = async () => {
    try {
      const response: IResponse<IStatus[]> = await axiosInstance.get(
        Endpoint.getStatusCategories
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static getById = async (projectId: string, id: string) => {
    try {
      const response: IResponse<IStatus> = await axiosInstance.get(
        Endpoint.getStatus + projectId + "/statuses/" + id
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static create = async (projectId: string, payload: IStatus) => {
    try {
      const response: IResponse<IStatus> = await axiosInstance.post(
        Endpoint.getStatus + projectId + "/statuses",
        payload
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static update = async (
    projectId: string,
    id: string,
    payload: any
  ) => {
    try {
      const response: IResponse<IStatus> = await axiosInstance.put(
        Endpoint.getStatus + projectId + "/statuses/" + id,
        payload
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static delete = async (projectId: string, id: string) => {
    try {
      const response: IResponse<IStatus> = await axiosInstance.delete(
        Endpoint.getStatus + projectId + "/statuses/" + id
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };
}
