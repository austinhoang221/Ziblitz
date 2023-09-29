import { AxiosResponse } from "axios";

export interface IResponse<T> extends AxiosResponse{
    data: T,
}