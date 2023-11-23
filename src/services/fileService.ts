import Endpoint from "../app/api/endpoint";
import { IAuthentication } from "../app/models/IAuthentication";
import { axiosInstance } from "../app/middleware";
import { IResponse } from "../app/models/IResponse";
import { UploadFile } from "antd";
import { IFile } from "../app/models/IFile";
export class FileService {
  public static getByIssueId = async (issueId: string) => {
    try {
      console.log(Endpoint.loginUrl);
      const response: IResponse<IFile[]> = await axiosInstance.get(
        Endpoint.getFiles + issueId + "/attachments"
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };

  public static delete = async (issueId: string, fileId: string) => {
    try {
      const response: IResponse<string> = await axiosInstance.delete(
        Endpoint.getFiles + issueId + "/attachments/" + fileId
      );
      console.log("POST response:", response.data);
      return response;
    } catch (error) {
      console.error("Error making POST request:", error);
    }
  };
}
