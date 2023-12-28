import Endpoint from "../app/api/endpoint";
import { axiosInstance } from "../app/middleware";
import { IIssueType } from "../app/models/IIssueType";
import { IPaginateResponse } from "../app/models/IPaginateResponse";
import { IResponse } from "../app/models/IResponse";

export class IssueTypeService {
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
      const response: IPaginateResponse<IIssueType[]> = await axiosInstance.get(
        Endpoint.getIssueType + projectId + "/issuetypes" + query
      );
      console.log("POST response:", response.data.content);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static getById = async (projectId: string, id: string) => {
    try {
      const response: IResponse<IIssueType> = await axiosInstance.get(
        Endpoint.getIssueType + projectId + "/issuetypes/" + id
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static create = async (projectId: string, payload: IIssueType) => {
    try {
      const response: IResponse<IIssueType> = await axiosInstance.post(
        Endpoint.getIssueType + projectId + "/issuetypes",
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
      const response: IResponse<IIssueType> = await axiosInstance.put(
        Endpoint.getIssueType + projectId + "/issuetypes/" + id,
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
      const request = transferId ? "?newIssueTypeId=" + transferId : "";
      const response: IResponse<IIssueType> = await axiosInstance.delete(
        Endpoint.getIssueType + projectId + "/issuetypes/" + id + request
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };
}
