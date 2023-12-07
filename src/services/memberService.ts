import Endpoint from "../app/api/endpoint";
import { axiosInstance } from "../app/middleware";
import { IMember } from "../app/models/IMember";
import { IPaginateResponse } from "../app/models/IPaginateResponse";
import { IResponse } from "../app/models/IResponse";

export class MemberService {
  public static getAll = async (
    projectId: string,
    pageNum: number,
    pageSize: number,
    sorts: string[]
  ) => {
    let query: string = `?PageNum=${pageNum}&PageSize=${pageSize}`;
    if (sorts.length > 0) {
      query += "&sort=";
      sorts.forEach((sort, index) => {
        query += sort;
        if (index !== sorts.length - 1) query += ",";
      });
    }
    try {
      const response: IPaginateResponse<IMember[]> = await axiosInstance.get(
        Endpoint.getMembers + projectId + "/members" + query
      );
      console.log("POST response:", response.data.content);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static update = async (
    projectId: string,
    id: string,
    payload: any
  ) => {
    try {
      const response: IResponse<IMember> = await axiosInstance.put(
        Endpoint.getMembers + projectId + "/members/" + id,
        payload
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static delete = async (projectId: string, id: string) => {
    try {
      const response: IResponse<IMember> = await axiosInstance.delete(
        Endpoint.getMembers + projectId + "/members/" + id
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };
}
