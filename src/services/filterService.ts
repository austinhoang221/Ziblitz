import Endpoint from "../app/api/endpoint";
import { axiosInstance } from "../app/middleware";
import { IFilter } from "../app/models/IFilter";
import { IIssue } from "../app/models/IIssue";
import { IPaginateResponse } from "../app/models/IPaginateResponse";
import { IResponse } from "../app/models/IResponse";

export class FilterService {
  public static create = async (projectId: string) => {
    try {
      const response: IPaginateResponse<IIssue[]> = await axiosInstance.get(
        Endpoint.getFilters
      );
      console.log("POST response:", response.data.content);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static getAllIssue = async (payload: any) => {
    try {
      const response: IResponse<IIssue[]> = await axiosInstance.post(
        Endpoint.getFilters + "/get-issues",
        payload
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static delete = async (id: string) => {
    try {
      const response: IResponse<IFilter> = await axiosInstance.delete(
        Endpoint.getFilters + id
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };
}
