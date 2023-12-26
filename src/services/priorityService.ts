import Endpoint from "../app/api/endpoint";
import { axiosInstance } from "../app/middleware";
import { IPriority } from "../app/models/IPriority";
import { IPaginateResponse } from "../app/models/IPaginateResponse";
import { IResponse } from "../app/models/IResponse";

export class PriorityService {
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
      const response: IPaginateResponse<IPriority[]> = await axiosInstance.get(
        Endpoint.getIssueType + projectId + "/priorities" + query
      );
      console.log("POST response:", response.data.content);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static getById = async (projectId: string, id: string) => {
    try {
      const response: IResponse<IPriority> = await axiosInstance.get(
        Endpoint.getIssueType + projectId + "/priorities/" + id
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static create = async (projectId: string, payload: IPriority) => {
    try {
      const response: IResponse<IPriority> = await axiosInstance.post(
        Endpoint.getIssueType + projectId + "/priorities",
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
      const response: IResponse<IPriority> = await axiosInstance.put(
        Endpoint.getIssueType + projectId + "/priorities/" + id,
        payload
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static delete = async (
    projectId: string,
    id: string,
    transferId?: string
  ) => {
    try {
      const request = transferId ? "?newId=" + transferId : "";

      const response: IResponse<IPriority> = await axiosInstance.delete(
        Endpoint.getIssueType + projectId + "/priorities/" + id + request
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };
}
