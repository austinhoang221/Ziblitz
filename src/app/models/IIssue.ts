import { PriorityEnum } from "../enums/PriorityEnum";
import { IIssueDetail } from "./IIssueDetail";
import { IIssueType } from "./IIssueType";
import { IUser } from "./IUser";

export interface IIssue {
  id: string;
  code: string;
  parentId: string | null;
  parentName: string | null;
  sprintId: string | null;
  backlogId: string | null;
  priorityId: string | null;
  issueTypeId: string;
  name: string;
  description: string;
  creationTime: string;
  completeTime: string;
  priority: PriorityEnum;
  watcher: IUser[];
  voted: string;
  startDate: string;
  dueDate: string;
  statusId: string;
  issueDetail: IIssueDetail;
  issueType: IIssueType;
}
