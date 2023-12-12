import Endpoint from "../app/api/endpoint";
import { axiosInstance } from "../app/middleware";
import { ILabel } from "../app/models/ILabel";
import { IPaginateResponse } from "../app/models/IPaginateResponse";
import { IResponse } from "../app/models/IResponse";

export class LabelService {
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
      const response: IPaginateResponse<ILabel[]> = await axiosInstance.get(
        Endpoint.getStatus + projectId + "/labels" + query
      );
      console.log("POST response:", response.data.content);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static getById = async (projectId: string, id: string) => {
    try {
      const response: IResponse<ILabel> = await axiosInstance.get(
        Endpoint.getLabel + projectId + "/labels/" + id
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static create = async (projectId: string, payload: ILabel) => {
    try {
      const response: IResponse<ILabel> = await axiosInstance.post(
        Endpoint.getLabel + projectId + "/labels",
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
      const response: IResponse<ILabel> = await axiosInstance.put(
        Endpoint.getLabel + projectId + "/labels/" + id,
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
      const response: IResponse<ILabel> = await axiosInstance.delete(
        Endpoint.getLabel + projectId + "/labels/" + id
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };
}
