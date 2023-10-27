import { PriorityEnum } from "../enums/PriorityEnum";
import { IIssueDetail } from "./IIssueDetail";
import { IUser } from "./IUser";

export interface IIssue {
  id: string;
  code: string;
  parentId: string | null;
  sprintId: string | null;
  backlogId: string | null;
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
}
