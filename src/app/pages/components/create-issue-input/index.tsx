import { Button, Dropdown, Input, Menu } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { IssueService } from "../../../../services/issueService";
import { checkResponseStatus } from "../../../helpers";
import IssueTypeSelect from "../issue-type-select";
export default function CreateIssueInput(props: any) {
  const [issueTypeKey, setIssueTypeKey] = useState<string>("");
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
  const onChangeIssueType = (e: any) => {
    const issueTypeName = project?.issueTypes?.find(
      (type) => type.id === e.key
    )?.name;
    setIssueTypeKey(issueTypeName!);
  };
  const onSaveIssue = (e: any) => {
    IssueService.createBacklogIssueByName(props.periodId, {
      name: e.target.value,
      issueTypeId: issueTypeKey,
      creatorUserId: userId,
    }).then((res) => {
      if (checkResponseStatus(res)) {
        props.onSaveIssue();
      }
    });
  };
  return (
    <>
      <div className="w-100 d-flex">
        <IssueTypeSelect
          issueTypeKey={issueTypeKey}
          onChangeIssueType={onChangeIssueType}
        ></IssueTypeSelect>
        <Input
          placeholder="What need to be done?"
          onPressEnter={(e) => onSaveIssue(e)}
        ></Input>
      </div>
    </>
  );
}
