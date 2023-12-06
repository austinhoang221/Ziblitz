import { Select } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getProjectByCode } from "../../../../redux/slices/projectDetailSlice";
import { RootState } from "../../../../redux/store";
import { IssueService } from "../../../../services/issueService";
import { useAppDispatch } from "../../../customHooks/dispatch";
import { checkResponseStatus } from "../../../helpers";
import { IIssueComponentProps } from "../../../models/IIssueComponent";
import { BaseSelectRef } from "rc-select";
import { IPagination } from "../../../models/IPagination";
import usePriorityData from "../../../customHooks/fetchPriority";

export default function SelectPriority(props: IIssueComponentProps) {
  const initialRequestParam: IPagination = {
    pageNum: 1,
    pageSize: 10,
    sort: ["name:asc"],
  };
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
  const dispatch = useAppDispatch();
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  const [isLoadingSave, setIsLoadingSave] = useState(false);

  const [requestParam, setRequestParam] =
    useState<IPagination>(initialRequestParam);

  const { listPriority, isLoading } = usePriorityData(
    project?.id!,
    requestParam
  );

  const onChangePriority = async (e: any) => {
    setIsLoadingSave(true);
    if (props.type === "backlog") {
      await IssueService.editBacklogIssue(props.periodId, props.issueId, {
        priorityId: e,
        modificationUserId: userId,
      }).then((res) => {
        if (checkResponseStatus(res)) {
          dispatch(getProjectByCode(project?.code!));
          props.onSaveIssue(res?.data);
          setIsLoadingSave(false);
        }
      });
    } else {
      await IssueService.editSprintIssue(props.periodId, props.issueId, {
        priorityId: e,
        modificationUserId: userId,
      }).then((res) => {
        if (checkResponseStatus(res)) {
          dispatch(getProjectByCode(project?.code!));
          props.onSaveIssue(res?.data);
          setIsLoadingSave(false);
        }
      });
    }
  };

  return (
    <Select
      style={{ width: "150px" }}
      className={props.className}
      showSearch
      defaultValue={props.selectedId}
      options={listPriority.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      })}
      onChange={(e) => onChangePriority(e)}
      onFocus={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onBlur={props.onBlur}
      loading={isLoading || isLoadingSave}
    ></Select>
  );
}
