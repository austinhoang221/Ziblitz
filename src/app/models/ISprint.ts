import { IIssue } from "./IIssue";

export interface ISprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  goal: string;
  projectId: string;
  isComplete: boolean;
  isStart: boolean;
  issues: IIssue[];
}
