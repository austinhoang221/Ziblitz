import { IIssue } from "./IIssue";

export interface IVersion {
  id: string;
  name: string;
  startDate: string;
  releaseDate: string;
  description: string;
  driverId: string;
  projectId: string;
  statusId: string;
  issues: IIssue[];
}
