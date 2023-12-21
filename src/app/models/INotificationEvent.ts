export interface INotificationEvent {
  id: string;
  eventId: string;
  eventName: string;
  allWatcher: boolean;
  currentAssignee: boolean;
  reporter: boolean;
  projectLead: boolean;
}
