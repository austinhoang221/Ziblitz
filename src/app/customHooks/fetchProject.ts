import { useCallback, useEffect, useState } from "react";
import { setProjects } from "../../redux/slices/projectSlice";
import { ProjectService } from "../../services/projectService";
import { checkResponseStatus } from "../helpers";
import { IPagination } from "../models/IPagination";
import { IProject } from "../models/IProject";
import { useAppDispatch } from "./dispatch";

function useProjectData(userId: string, requestParam: IPagination) {
  const [listProject, setListOfData] = useState<IProject[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const fetchData = useCallback(() => {
    setLoading(true);
    ProjectService.getAll(
      userId,
      requestParam.pageNum,
      requestParam.pageSize,
      requestParam.sort
    ).then((res) => {
      if (checkResponseStatus(res)) {
        setListOfData(res?.data?.content!);
        setTotalCount(res?.data?.totalCount!);
        dispatch(setProjects(res?.data?.content!));
        setLoading(false);
      }
    });
  }, [userId, requestParam.pageNum, requestParam.pageSize]);

  const refreshData = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData, userId, requestParam.pageNum, requestParam.pageSize]);

  return { listProject, totalCount, refreshData, isLoading };
}

export default useProjectData;
