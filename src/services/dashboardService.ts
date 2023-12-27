import Endpoint from "../app/api/endpoint";
import { axiosInstance } from "../app/middleware";
import { IIssue } from "../app/models/IIssue";
import { IResponse } from "../app/models/IResponse";

export class DashBoardService {
  public static getProjectChart = async (projectId: string) => {
    try {
      const response: IResponse<any[]> = await axiosInstance.get(
        Endpoint.getChart + projectId + "/dashboards/circle-chart"
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static getSprintChart = async (projectId: string) => {
    try {
      const response: IResponse<any[]> = await axiosInstance.get(
        Endpoint.getChart + projectId + "/dashboards/column-chart"
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static getIssueChart = async (projectId: string, payload: any) => {
    try {
      const response: IResponse<IIssue[]> = await axiosInstance.post(
        Endpoint.getChart + projectId + "/dashboards/table-chart",
        payload
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };
}
