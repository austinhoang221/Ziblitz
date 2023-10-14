import { Button, Dropdown, Input, Menu, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBacklogIssues } from "../../../../redux/slices/projectDetailSlice";
import { RootState } from "../../../../redux/store";
import { IssueService } from "../../../../services/issueService";
import { checkResponseStatus } from "../../../helpers";
import IssueTypeSelect from "../issue-type-select";
export default function CreateIssueInput(props: any) {
  const [issueTypeName, setIssueTypeName] = useState<string>("Bug");
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
  const [issueTypeKey, setIssueTypeKey] = useState<string>(
    project?.issueTypes?.[0].id!
  );
  const backlogIssue = useSelector(
    (state: RootState) => state.projectDetail.backlogIssues
  );
  const dispatch = useDispatch();

  const onChangeIssueType = (e: any) => {
    const issueTypeName = project?.issueTypes?.find(
      (type) => type.id === e.key
    )?.name;
    setIssueTypeName(issueTypeName!);
    setIssueTypeKey(e.key);
  };

  const onSaveIssue = (e: any) => {
    if (e) {
      IssueService.createBacklogIssueByName(props.periodId, {
        name: e.target.value,
        issueTypeId: issueTypeKey,
        creatorUserId: userId,
      }).then((res) => {
        if (checkResponseStatus(res)) {
          props.onSaveIssue();
          const newBacklogIssues = [...backlogIssue!];
          newBacklogIssues.push(res?.data!);
          dispatch(setBacklogIssues(newBacklogIssues!));
        }
      });
    }
  };
  return (
    <>
      <div className="w-100 d-flex">
        <IssueTypeSelect
          issueTypeKey={issueTypeName}
          onChangeIssueType={onChangeIssueType}
        ></IssueTypeSelect>
        <Input
          placeholder="What need to be done?"
          onPressEnter={(e) => onSaveIssue(e)}
          onBlur={props.onBlurCreateIssue}
        ></Input>
      </div>
    </>
  );
}
