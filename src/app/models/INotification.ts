import { INotificationEvent } from "./INotificationEvent";

export interface INotification {
  id: string;
  name: string;
  description: string;
  notificationEvent: INotificationEvent[];
}
