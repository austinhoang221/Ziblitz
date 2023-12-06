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

export default function SelectSprint(props: IIssueComponentProps) {
  const dispatch = useAppDispatch();
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef<BaseSelectRef>(null);
  useEffect(() => {
    ref?.current?.focus();
  });
  const onChangeSprint = async (e: any) => {
    setIsLoading(true);
    if (props.type === "backlog") {
      const payload = {
        sprintId: e,
        backlogId: null,
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
          setIsLoading(false);
        }
      });
    } else {
      await IssueService.editSprintIssue(props.periodId, props.issueId, {
        sprintId: e,
        modificationUserId: userId,
      }).then((res) => {
        if (checkResponseStatus(res)) {
          dispatch(getProjectByCode(project?.code!));
          props.onSaveIssue(res?.data);
          setIsLoading(false);
        }
      });
    }
  };
  return (
    <Select
      loading={isLoading}
      style={{ width: "150px" }}
      className={props.className}
      showSearch
      ref={ref}
      defaultValue={props.selectedId}
      options={project?.sprints.map((sprint) => {
        return {
          label: sprint.name,
          value: sprint.id,
        };
      })}
      onChange={(e) => onChangeSprint(e)}
      onFocus={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onBlur={props.onBlur}
    ></Select>
  );
}
