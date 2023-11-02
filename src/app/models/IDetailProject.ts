import { IBacklog } from "./IBacklog";
import { IIssue } from "./IIssue";
import { IIssueType } from "./IIssueType";
import { ISprint } from "./ISprint";
import { IStatus } from "./IStatus";
import { IUser } from "./IUser";

export interface IDetailProject {
  id: string;
  name: string;
  code: string;
  description: string;
  avatarUrl: string;
  isFavorite: boolean;
  leader: IUser;
  members: IUser[];
  epics: IIssue[];
  backlog: IBacklog;
  sprints: ISprint[];
  issueTypes: IIssueType[];
  statuses: IStatus[];
}
