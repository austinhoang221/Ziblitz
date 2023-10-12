import { PriorityEnum } from "../enums/PriorityEnum";
import { IUser } from "./IUser";

export interface IIssue {
  id: string,
  parentId: string | null,
  sprintId: string | null,
  issueTypeId: string,
  name: string,
  description: string,
  creationTime: string,
  completeTime: string,
  priority: PriorityEnum,
  watcher: IUser[],
  voted: string,
  startDate: string,
  dueDate: string,
}