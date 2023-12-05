import Endpoint from "../app/api/endpoint";
import { axiosInstance } from "../app/middleware";
import { IPaginateResponse } from "../app/models/IPaginateResponse";
import { IPermissionGroup } from "../app/models/IPermission";
import { IResponse } from "../app/models/IResponse";

export class PermissionService {
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
      const response: IPaginateResponse<IPermissionGroup[]> =
        await axiosInstance.get(
          Endpoint.getPermission + projectId + "/permissiongroups" + query
        );
      console.log("POST response:", response.data.content);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static create = async (
    projectId: string,
    payload: IPermissionGroup
  ) => {
    try {
      const response: IResponse<IPermissionGroup> = await axiosInstance.post(
        Endpoint.getPermission + projectId + "/permissiongroups",
        payload
      );
      console.log("POST response:", response.data);
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
      const response: IResponse<IPermissionGroup> = await axiosInstance.put(
        Endpoint.getPermission + projectId + "/permissiongroups/" + id,
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
      const response: IResponse<IPermissionGroup> = await axiosInstance.delete(
        Endpoint.getPermission + projectId + "/permissiongroups/" + id
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };
}
