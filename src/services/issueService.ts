import Endpoint from "../app/api/endpoint";
import { axiosInstance } from "../app/middleware";
import { IIssue } from "../app/models/IIssue";
import { IResponse } from "../app/models/IResponse";

export class IssueService {
    public static createBacklogIssueByName = async (backlogId: string, payload: any) => {
        try {
        const response: IResponse<IIssue> = await axiosInstance.post(Endpoint.createBacklogIssue + backlogId + '/issues:name', payload);
        console.log('POST response:', response.data);
          return response;
        } catch (error) {
          console.error('Error making POST request:', error);
        }
      };

      public static createSprintIssueByName = async (sprintId: string, payload: any) => {
        try {
        const response: IResponse<IIssue> = await axiosInstance.post(Endpoint.createSprintIssue + sprintId + '/issues:name', payload);
        console.log('POST response:', response.data);
          return response;
        } catch (error) {
          console.error('Error making POST request:', error);
        }
      };
    }
    
