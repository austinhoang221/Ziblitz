import { AxiosResponse } from "axios";

export interface IResponse<T>{
    data: T,
    message: string,
    statusCode: number
}