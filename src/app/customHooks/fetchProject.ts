import { useCallback, useEffect, useState } from "react";
import { ProjectService } from "../../services/projectService";
import { checkResponseStatus } from "../helpers";
import { IPagination } from "../models/IPagination";
import { IProject } from "../models/IProject";

function useProjectData(userId: string, requestParam: IPagination) {
    const [listProject, setListOfData] = useState<IProject[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const fetchData = useCallback(() => {
      ProjectService.getAll(
        userId,
        requestParam.pageNum,
        requestParam.pageSize,
        requestParam.sort,
      ).then((res) => {
        if (checkResponseStatus(res)) {
          setListOfData(res?.data?.content!);
          setTotalCount(res?.data?.totalCount!);
        }
      });
    }, [userId, requestParam.pageNum, requestParam.pageSize]);
  
    const refreshData = () => {
      fetchData();
    };

    useEffect(() => {
        fetchData();
      }, [fetchData, userId, requestParam.pageNum, requestParam.pageSize]);
    
      return { listProject, totalCount, refreshData };
    }
  
  export default useProjectData;