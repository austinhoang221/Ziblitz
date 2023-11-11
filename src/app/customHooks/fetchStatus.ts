import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { PriorityService } from "../../services/priorityService";
import { StatusService } from "../../services/statusService";
import { checkResponseStatus } from "../helpers";
import { IPagination } from "../models/IPagination";
import { IStatus } from "../models/IStatus";

function useStatusData(projectId: string, requestParam: IPagination) {
  const [listStatus, setListOfData] = useState<IStatus[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(false);
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
  const fetchData = useCallback(() => {
    setLoading(true);
    StatusService.getAll(
      projectId,
      requestParam.pageNum,
      requestParam.pageSize,
      requestParam.sort
    ).then((res) => {
      if (checkResponseStatus(res)) {
        setListOfData(res?.data?.content!);
        setTotalCount(res?.data?.totalCount!);
        setLoading(false);
      }
    });
  }, [
    projectId,
    requestParam.pageNum,
    requestParam.pageSize,
    requestParam.sort,
  ]);

  const refreshData = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData, project?.id, requestParam.pageNum, requestParam.pageSize]);

  return { listStatus, totalCount, refreshData, isLoading };
}

export default useStatusData;
