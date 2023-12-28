import Endpoint from "../app/api/endpoint";
import { axiosInstance } from "../app/middleware";
import { IResponse } from "../app/models/IResponse";
import { IVersion } from "../app/models/IVersion";
import { IVersionStatus } from "../app/models/IVersionStatus";

export class VersionService {
  public static getAll = async (projectId: string) => {
    try {
      const response: IResponse<IVersion[]> = await axiosInstance.get(
        Endpoint.getVersion + projectId + "/versions"
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static getCategories = async (projectId: string) => {
    try {
      const response: IResponse<IVersionStatus[]> = await axiosInstance.get(
        Endpoint.getVersion + projectId + "/statuses/versions"
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static create = async (projectId: string, payload: any) => {
    try {
      const response: IResponse<IVersion> = await axiosInstance.post(
        Endpoint.getVersion + projectId + "/versions",
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
      const response: IResponse<IVersion> = await axiosInstance.put(
        Endpoint.getVersion + projectId + "/versions/" + id,
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
      const response: IResponse<IVersion> = await axiosInstance.delete(
        Endpoint.getVersion + projectId + "/versions/" + id + request
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static addIssue = async (projectId: string, id: string) => {
    try {
      const response: IResponse<IVersion> = await axiosInstance.put(
        Endpoint.getVersion + projectId + "/versions/" + id + "/issues:add"
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };
}
