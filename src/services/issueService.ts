import { Task } from "gantt-task-react";
import Endpoint from "../app/api/endpoint";
import { axiosInstance } from "../app/middleware";
import { IIssue } from "../app/models/IIssue";
import { IIssueComment } from "../app/models/IIssueComment";
import { IIssueHistory } from "../app/models/IIssueHistory";
import { IResponse } from "../app/models/IResponse";

export class IssueService {
  public static createBacklogIssueByName = async (
    backlogId: string,
    payload: any
  ) => {
    try {
      const response: IResponse<IIssue> = await axiosInstance.post(
        Endpoint.createBacklogIssue + backlogId + "/issues/:name",
        payload
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static getAll = async (projectId: string) => {
    try {
      const response: IResponse<Task[]> = await axiosInstance.get(
        Endpoint.getAll + projectId + "/issues"
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static getById = async (id: string) => {
    try {
      const response: IResponse<IIssue> = await axiosInstance.get(
        Endpoint.getIssue + id
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static getHistories = async (id: string) => {
    try {
      const response: IResponse<IIssueHistory[]> = await axiosInstance.get(
        Endpoint.getIssueHistories + id + "/issuehistories"
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static getComments = async (issueId: string) => {
    try {
      const response: IResponse<IIssueComment[]> = await axiosInstance.get(
        Endpoint.getIssueHistories + issueId + "/comments"
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static createComment = async (issueId: string, payload: any) => {
    try {
      const response: IResponse<IIssueComment> = await axiosInstance.post(
        Endpoint.getIssueComment + issueId + "/comments",
        payload
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static updateComment = async (
    issueId: string,
    id: string,
    payload: any
  ) => {
    try {
      const response: IResponse<IIssueComment> = await axiosInstance.put(
        Endpoint.getIssueComment + issueId + "/comments/" + id,
        payload
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static deleteComment = async (issueId: string, id: string) => {
    try {
      const response: IResponse<IIssueComment> = await axiosInstance.delete(
        Endpoint.getIssueComment + issueId + "/comments/" + id
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static createSprintIssueByName = async (
    sprintId: string,
    payload: any
  ) => {
    try {
      const response: IResponse<IIssue> = await axiosInstance.post(
        Endpoint.createSprintIssue + sprintId + "/issues/:name",
        payload
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static createEpic = async (projectId: string, payload: any) => {
    try {
      const response: IResponse<IIssue> = await axiosInstance.post(
        Endpoint.createEpic + projectId + "/epics",
        payload
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static updateEpic = async (
    projectId: string,
    epicId: string,
    payload: any
  ) => {
    try {
      const response: IResponse<IIssue> = await axiosInstance.put(
        Endpoint.updateEpic + projectId + "/epics/" + epicId,
        payload
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static editBacklogIssue = async (
    backlogId: string,
    id: string,
    payload: any
  ) => {
    try {
      const response: IResponse<IIssue> = await axiosInstance.patch(
        Endpoint.editBacklogIssue + backlogId + "/issues/" + id,
        payload
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static editSprintIssue = async (
    sprintId: string,
    id: string,
    payload: any
  ) => {
    try {
      const response: IResponse<IIssue> = await axiosInstance.patch(
        Endpoint.editSprintIssue + sprintId + "/issues/" + id,
        payload
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static deleteIssue = async (backlogId: string, id: string) => {
    try {
      const response: IResponse<IIssue> = await axiosInstance.delete(
        Endpoint.editSprintIssue + backlogId + "/issues/" + id
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };
}
