import { Select } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { IIssueComponentProps } from "../../../models/IIssueComponent";
import { BaseSelectRef } from "rc-select";
import useVersionData from "../../../customHooks/fetchVersion";
import { IssueService } from "../../../../services/issueService";
import { checkResponseStatus } from "../../../helpers";
import { getProjectByCode } from "../../../../redux/slices/projectDetailSlice";
import { useAppDispatch } from "../../../customHooks/dispatch";

export default function IssueVersionSelect(props: IIssueComponentProps) {
  const dispatch = useAppDispatch();
  const { project } = useSelector((state: RootState) => state.projectDetail);
  const ref = useRef<BaseSelectRef>(null);
  const {
    listVersion,
    isLoading: isLoadingVersion,
    refreshData,
  } = useVersionData(project?.id!);
  const [isLoading, setIsLoading] = useState(false);
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;

  useEffect(() => {
    ref?.current?.focus();
  });
  const onSave = async (e: any) => {
    setIsLoading(true);
    let uniqueItems = [...new Set(e)];
    if (props.type === "backlog") {
      const payload = {
        versionIds: uniqueItems,
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
        versionIds: uniqueItems,
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
      IssueService.updateEpic(project?.id!, props.issueId, {
        versionIds: uniqueItems,
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
      loading={isLoadingVersion || isLoading}
      style={{ width: "150px" }}
      className={props.className}
      showSearch
      ref={ref}
      defaultValue={props.selectedId}
      options={listVersion?.map((version) => {
        return {
          label: version.name,
          value: version.id,
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
