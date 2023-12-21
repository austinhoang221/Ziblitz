import Endpoint from "../app/api/endpoint";
import { axiosInstance } from "../app/middleware";
import { IIssueEvent } from "../app/models/IIssueEvent";
import { INotification } from "../app/models/INotification";
import { IResponse } from "../app/models/IResponse";

export class NotificationService {
  public static getEvents = async () => {
    try {
      const response: IResponse<IIssueEvent[]> = await axiosInstance.get(
        Endpoint.getIssueEvent
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static getNotificationEvents = async (id: string) => {
    try {
      const response: IResponse<INotification[]> = await axiosInstance.get(
        Endpoint.getNotificationEvent + id + "/notificationevents"
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static createNotificationEvent = async (id: string, payload: any) => {
    try {
      const response: IResponse<INotification> = await axiosInstance.post(
        Endpoint.getNotificationEvent + id + "/notificationevents",
        payload
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static updateNotificationEvent = async (
    id: string,
    notificationEventId: string,
    payload: any
  ) => {
    try {
      const response: IResponse<INotification> = await axiosInstance.put(
        Endpoint.getNotificationEvent +
          id +
          "/notificationevents/" +
          notificationEventId,
        payload
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static deleteNotificationEvent = async (
    id: string,
    notificationEventId: string
  ) => {
    try {
      const response: IResponse<INotification> = await axiosInstance.delete(
        Endpoint.getNotificationEvent +
          id +
          "/notificationevents/" +
          notificationEventId
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static getNotifications = async (projectId: string) => {
    try {
      const response: IResponse<INotification> = await axiosInstance.get(
        Endpoint.getNotification + projectId + "/notifications"
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };
}
