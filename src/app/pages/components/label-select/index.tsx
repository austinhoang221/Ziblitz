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
import useLabelData from "../../../customHooks/fetchLabel";
import { IPagination } from "../../../models/IPagination";

export default function SelectLabel(props: IIssueComponentProps) {
  const dispatch = useAppDispatch();
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
  const initialRequestParam: IPagination = {
    pageNum: 1,
    pageSize: 20,
    sort: ["name:asc"],
  };
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef<BaseSelectRef>(null);
  const [requestParam, setRequestParam] =
    useState<IPagination>(initialRequestParam);
  const { listLabel, isLoading: isLoadingList } = useLabelData(
    project?.id!,
    requestParam
  );

  useEffect(() => {
    ref?.current?.focus();
  });
  const onSave = async (e: any) => {
    setIsLoading(true);
    let uniqueItems = [...new Set(e)];
    if (props.type === "backlog") {
      const payload = {
        labelIds: uniqueItems,
        modificationUserId: userId,
      };
      await IssueService.editBacklogIssue(
        props.periodId,
        props.issueId,
        payload
      ).then((res) => {
        if (checkResponseStatus(res)) {
          dispatch(getProjectByCode(project?.code!));
          props.onSaveIssue(res?.data);
          ref.current?.blur();

          setIsLoading(false);
        }
      });
    } else if (props.type === "sprint") {
      await IssueService.editSprintIssue(props.periodId, props.issueId, {
        labelIds: uniqueItems,
        modificationUserId: userId,
      }).then((res) => {
        if (checkResponseStatus(res)) {
          dispatch(getProjectByCode(project?.code!));
          props.onSaveIssue(res?.data);
          ref.current?.blur();
          setIsLoading(false);
        }
      });
    } else {
      await IssueService.updateEpic(props.periodId, props.issueId, {
        labelIds: uniqueItems,
        modificationUserId: userId,
      }).then((res) => {
        if (checkResponseStatus(res)) {
          dispatch(getProjectByCode(project?.code!));
          props.onSaveIssue(res?.data);
          ref.current?.blur();
          setIsLoading(false);
        }
      });
    }
  };
  return (
    <Select
      mode="multiple"
      allowClear
      loading={isLoadingList || isLoading}
      style={{ width: "150px" }}
      className={props.className}
      showSearch
      ref={ref}
      defaultValue={props.selectedId}
      options={listLabel?.map((label) => {
        return {
          label: label.name,
          value: label.id,
        };
      })}
      onChange={onSave}
      onClear={() => onSave([])}
      onFocus={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onBlur={props.onBlur}
    ></Select>
  );
}
