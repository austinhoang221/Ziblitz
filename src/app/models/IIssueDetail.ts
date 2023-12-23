import { ILabel } from "./ILabel";
import { IVersion } from "./IVersion";

export interface IIssueDetail {
  id: string;
  assigneeId: string;
  reporterId: string;
  storyPointEstimate: string;
  labels: ILabel[];
  versions: IVersion[];
}
