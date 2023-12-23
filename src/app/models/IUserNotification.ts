import { IIssueType } from "./IIssueType";

export interface IUserNotification {
    id: string;
    name: string;
    creatorUsername: string;
    creatorUserId: string;
    issueId: string;
    issueName: string;
    issueCode: string;
    issueType: IIssueType;
    statusName: string;
    isRead: boolean;
  }
  