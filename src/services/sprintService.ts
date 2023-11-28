import Endpoint from "../app/api/endpoint";
import { axiosInstance } from "../app/middleware";
import { IIssueOnBoard } from "../app/models/IProject";
import { IResponse } from "../app/models/IResponse";
import { ISprint } from "../app/models/ISprint";

export class SprintService {
  public static getAllIssue = async (projectId: string, payload: any) => {
    let query = Endpoint.getSprintIssue + projectId + "/sprints/get-sprints";
    try {
      const response: IResponse<IIssueOnBoard> = await axiosInstance.post(
        query,
        payload
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static createSprint = async (projectId: string) => {
    try {
      const response: IResponse<ISprint> = await axiosInstance.post(
        Endpoint.createSprint + projectId + "/sprints/:no-field"
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static startSprint = async (
    projectId: string,
    sprintId: string,
    payload: any
  ) => {
    try {
      const response: IResponse<ISprint> = await axiosInstance.put(
        Endpoint.startSprint + projectId + "/sprints/" + sprintId + ":start",
        payload
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static completeSprint = async (
    projectId: string,
    sprintId: string
  ) => {
    try {
      const response: IResponse<ISprint> = await axiosInstance.put(
        Endpoint.completeSprint +
          projectId +
          "/sprints/" +
          sprintId +
          ":complete"
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static getById = async (projectId: string, sprintId: string) => {
    try {
      const response: IResponse<ISprint> = await axiosInstance.get(
        Endpoint.getSprintById + projectId + "/sprints/" + sprintId
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static updateSprint = async (
    projectId: string,
    sprintId: string,
    payload: any
  ) => {
    try {
      const response: IResponse<ISprint> = await axiosInstance.put(
        Endpoint.updateSprint + projectId + "/sprints/" + sprintId,
        payload
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static deleteSprint = async (projectId: string, sprintId: string) => {
    try {
      const response: IResponse<ISprint> = await axiosInstance.delete(
        Endpoint.deleteSprint + projectId + "/sprints/" + sprintId
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };
}
