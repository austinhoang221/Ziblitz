import { IUser } from "./IUser";

export interface IAuthentication extends IUser{
    isLoggedIn: boolean,
    token: string,
}