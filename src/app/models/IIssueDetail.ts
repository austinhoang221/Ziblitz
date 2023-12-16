import { ILabel } from "./ILabel";

export interface IIssueDetail {
  id: string;
  assigneeId: string;
  reporterId: string;
  storyPointEstimate: string;
  labels: ILabel[];
}
