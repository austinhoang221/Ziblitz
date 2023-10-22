import { IBacklog } from "./IBacklog";
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
  backlog: IBacklog;
  sprints: ISprint[];
  issueTypes: IIssueType[];
  statuses: IStatus[];
}
