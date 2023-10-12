import { IBacklog } from "./IBacklog";
import { IIssueType } from "./IIssueType";
import { IUser } from "./IUser";

export interface IDetailProject {
    id: string,
    name: string,
    code: string,
    description: string,
    avatarUrl: string,
    isFavorite: boolean,
    leader: IUser,
    members: IUser[],
    backlog: IBacklog,
    issueTypes: IIssueType[]
}