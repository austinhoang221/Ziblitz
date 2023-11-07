import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { IssueTypeService } from "../../services/issueTypeService";
import { checkResponseStatus } from "../helpers";
import { IIssueType } from "../models/IIssueType";
import { IPagination } from "../models/IPagination";
import { IProject } from "../models/IProject";

function useIssueTypeData(projectId: string, requestParam: IPagination) {
  const [listIssueType, setListOfData] = useState<IIssueType[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
  const fetchData = useCallback(() => {
    IssueTypeService.getAll(
      projectId,
      requestParam.pageNum,
      requestParam.pageSize,
      requestParam.sort
    ).then((res) => {
      if (checkResponseStatus(res)) {
        setListOfData(res?.data?.content!);
        setTotalCount(res?.data?.totalCount!);
      }
    });
  }, [
    project?.id,
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

  return { listIssueType, totalCount, refreshData };
}

export default useIssueTypeData;
