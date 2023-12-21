import { IIssue } from "./IIssue";
import { IIssueType } from "./IIssueType";
import { IUser } from "./IUser";
export interface IIssueOnBoard {
  [issueType: string]: IIssue[];
}
export interface IProject {
  id: string;
  name: string;
  code: string;
  description: string;
  avatarUrl: string;
  isFavourite: boolean;
  leader: IUser;
  members: IUser[];
  epics: IIssue[];
  issueTypes: IIssueType[];
  issueOnBoard: IIssueOnBoard;
}
