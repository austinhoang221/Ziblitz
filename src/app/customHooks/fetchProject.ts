import { useCallback, useEffect, useState } from "react";
import { ProjectService } from "../../services/projectService";
import { checkResponseStatus } from "../helpers";
import { IPagination } from "../models/IPagination";
import { IProject } from "../models/IProject";

function useProjectData(userId: string, requestParam: IPagination) {
    const [listOfData, setListOfData] = useState<IProject[]>([]);
  
    const fetchData = useCallback(() => {
      ProjectService.getAllProject(
        userId,
        requestParam.pageNum,
        requestParam.pageSize
      ).then((res) => {
        if (checkResponseStatus(res)) {
          setListOfData(res?.data!);
        }
      });
    }, [userId, requestParam.pageNum, requestParam.pageSize]);
  
    useEffect(() => {
        fetchData();
      }, [fetchData, userId, requestParam.pageNum, requestParam.pageSize]);
    
      return { listOfData };
    }
  
  export default useProjectData;