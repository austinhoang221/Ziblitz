import { IIssue } from "./IIssue";

export interface IBacklog{
    id: string,
    name: string,
    issues: IIssue[]
}