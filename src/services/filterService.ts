import Endpoint from "../app/api/endpoint";
import { axiosInstance } from "../app/middleware";
import { IFilter } from "../app/models/IFilter";
import { IIssue } from "../app/models/IIssue";
import { IResponse } from "../app/models/IResponse";

export class FilterService {
  public static getALl = async (userId: string) => {
    try {
      const response: IResponse<IFilter[]> = await axiosInstance.get(
        Endpoint.getAllUser + userId + "/filters"
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static getByFilterId = async (filterId: string) => {
    try {
      const response: IResponse<IIssue[]> = await axiosInstance.get(
        Endpoint.getFilterById + filterId + "/issues"
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static create = async (payload: any) => {
    try {
      const response: IResponse<IFilter> = await axiosInstance.post(
        Endpoint.getFilters,
        payload
      );
      console.log("POST response:", response.data);
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
