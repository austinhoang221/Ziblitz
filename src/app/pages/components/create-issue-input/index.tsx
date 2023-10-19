import { Button, Dropdown, Input, InputRef, Menu, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBacklogIssues } from "../../../../redux/slices/projectDetailSlice";
import { RootState } from "../../../../redux/store";
import { IssueService } from "../../../../services/issueService";
import { checkResponseStatus } from "../../../helpers";
import IssueTypeSelect from "../issue-type-select";
export default function CreateIssueInput(props: any, identifier: string) {
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [issueTypeName, setIssueTypeName] = useState<string>("Bug");
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  const ref = useRef<InputRef>(null);
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

  useEffect(() => {
    if (isCreate) {
      ref.current?.focus();
    }
  }, [isCreate]);

  const onCreateIssue = () => {
    setIsCreate(true);
  };
  const onChangeIssueType = (e: any) => {
    const issueTypeName = project?.issueTypes?.find(
      (type) => type.id === e.key
    )?.name;
    setIssueTypeName(issueTypeName!);
    setIssueTypeKey(e.key);
  };

  const onSaveIssue = (e: any) => {
    if (e) {
      if (props.type === "sprint") {
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
      } else {
        IssueService.createSprintIssueByName(props.periodId, {
          name: e.target.value,
          issueTypeId: issueTypeKey,
          creatorUserId: userId,
        }).then((res) => {
          if (checkResponseStatus(res)) {
            props.onSaveIssue();
            // const newBacklogIssues = [...backlogIssue!];
            // newBacklogIssues.push(res?.data!);
            // dispatch(setBacklogIssues(newBacklogIssues!));
          }
        });
      }
    }
  };
  return (
    <>
      {!isCreate ? (
        <Button
          type="text"
          className="w-100 mt-1 text-left"
          onClick={onCreateIssue}
        >
          <i className="fa-solid fa-plus mr-2"></i>
          <span className="font-weight-bold">Add upcoming work here</span>
        </Button>
      ) : (
        <div className="mt-1">
          <div className="w-100 d-flex">
            <IssueTypeSelect
              issueTypeKey={issueTypeName}
              onChangeIssueType={onChangeIssueType}
            ></IssueTypeSelect>
            <Input
              ref={ref}
              placeholder="What need to be done?"
              onPressEnter={(e) => onSaveIssue(e)}
              onBlur={() => setIsCreate(false)}
            ></Input>
          </div>
        </div>
      )}
    </>
  );
}
