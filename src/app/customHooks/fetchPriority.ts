import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { PriorityService } from "../../services/priorityService";
import { checkResponseStatus } from "../helpers";
import { IPagination } from "../models/IPagination";
import { IPriority } from "../models/IPriority";

function usePriorityData(projectId: string, requestParam: IPagination) {
  const [listPriority, setListOfData] = useState<IPriority[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(false);

  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
  const fetchData = useCallback(() => {
    setLoading(true);
    PriorityService.getAll(
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

  return { listPriority, totalCount, refreshData, isLoading };
}

export default usePriorityData;
