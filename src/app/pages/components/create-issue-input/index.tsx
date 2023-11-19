import { Button, Input, InputRef } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getProjectByCode } from "../../../../redux/slices/projectDetailSlice";
import { RootState } from "../../../../redux/store";
import { IssueService } from "../../../../services/issueService";
import { useAppDispatch } from "../../../customHooks/dispatch";
import { checkResponseStatus } from "../../../helpers";
import IssueTypeSelect from "../issue-type-select";
import { LoadingOutlined } from "@ant-design/icons";
export default function CreateIssueInput(props: any, identifier: string) {
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [issueTypeIcon, setIssueTypeIcon] = useState<string>("");
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  const ref = useRef<InputRef>(null);
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
  const [issueTypeKey, setIssueTypeKey] = useState<string>("");

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isCreate) {
      ref.current?.focus();
    }
    if (props.isSubtask) {
      setIssueTypeKey(
        project?.issueTypes.find((type) => type.name === "Subtask")?.id!
      );
      setIssueTypeIcon("Subtask");
    } else {
      setIssueTypeKey(
        project?.issueTypes.find((type) => type.name === "Bug")?.id!
      );
      setIssueTypeIcon("Bug");
    }
  }, [isCreate, project?.issueTypes, props.isSubtask]);

  const onCreateIssue = () => {
    setIsCreate(true);
  };
  const onChangeIssueType = (e: any) => {
    const issueTypeIcon = project?.issueTypes?.find(
      (type) => type.id === e.key
    )?.icon;
    setIssueTypeIcon(issueTypeIcon!);
    setIssueTypeKey(e.key);
  };

  const onSaveIssue = (e: any) => {
    if (e?.target.value) {
      setLoading(true);
      const payload: any = {
        name: e.target.value,
        issueTypeId: issueTypeKey,
        creatorUserId: userId,
        projectId: project?.id,
      };
      if (props.parentId) payload.parentId = props.parentId;
      if (props.type === "backlog") {
        IssueService.createBacklogIssueByName(props.periodId, payload).then(
          (res) => {
            if (checkResponseStatus(res)) {
              props.onSaveIssue(res?.data);
              dispatch(getProjectByCode(project?.code!));
              setIsCreate(false);
              setLoading(false);
            }
          }
        );
      } else {
        IssueService.createSprintIssueByName(props.periodId, payload).then(
          (res) => {
            if (checkResponseStatus(res)) {
              props.onSaveIssue();
              dispatch(getProjectByCode(project?.code!));
              setIsCreate(false);
              setLoading(false);
            }
          }
        );
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
            <Input
              prefix={
                <IssueTypeSelect
                  isSubtask={props.isSubtask}
                  issueTypeKey={issueTypeIcon}
                  onChangeIssueType={onChangeIssueType}
                ></IssueTypeSelect>
              }
              ref={ref}
              placeholder="What need to be done?"
              onPressEnter={(e) => onSaveIssue(e)}
              // onBlur={(e) => setIsCreate(false)}
              onKeyDownCapture={(e) => {
                if (e.key === "Escape") setIsCreate(false);
              }}
              suffix={isLoading ? <LoadingOutlined /> : <></>}
            ></Input>
          </div>
        </div>
      )}
    </>
  );
}
