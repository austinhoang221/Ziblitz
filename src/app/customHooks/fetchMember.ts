import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { MemberService } from "../../services/memberService";
import { checkResponseStatus } from "../helpers";
import { IMember } from "../models/IMember";
import { IPagination } from "../models/IPagination";

function useMemberData(projectId: string, requestParam: IPagination) {
  const [listMember, setListOfData] = useState<IMember[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(false);

  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
  const fetchData = useCallback(() => {
    setLoading(true);
    MemberService.getAll(
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
    if (project?.id) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id, requestParam.pageNum, requestParam.pageSize]);

  return { listMember, totalCount, refreshData, isLoading };
}

export default useMemberData;
