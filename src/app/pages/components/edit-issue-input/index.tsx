import React, { useEffect, useRef, useState } from "react";
import { Input, Button, InputRef, Tooltip } from "antd";
import { IssueService } from "../../../../services/issueService";
import { checkResponseStatus } from "../../../helpers";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../customHooks/dispatch";
import { getProjectByCode } from "../../../../redux/slices/projectDetailSlice";
import { RootState } from "../../../../redux/store";
import "./index.scss";
import { useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";

interface IEditIssueInput {
  periodId: string;
  initialValue: string;
  issueId: string;
  type: string;
  onSaveIssue: () => void;
}
const EditIssueInput = (props: IEditIssueInput) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedValue, setEditedValue] = useState(props.initialValue);
  const dispatch = useAppDispatch();
  const ref = useRef<InputRef>(null);
  const navigate = useNavigate();
  const { project, projectPermissions } = useSelector(
    (state: RootState) => state.projectDetail
  );
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;

  useEffect(() => {
    if (isEditing) {
      ref.current?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditedValue(props.initialValue);
  }, [props.initialValue]);

  const onEditIssue = () => {
    setIsEditing(true);
  };

  const onSaveIssue = (e: any) => {
    if (e?.target.value) {
      setIsLoading(true);
      if (props.type === "backlog") {
        IssueService.editBacklogIssue(props.periodId, props.issueId, {
          name: e.target.value,
          modificationUserId: userId,
        }).then((res) => {
          if (checkResponseStatus(res)) {
            dispatch(getProjectByCode(project?.code!));
            setIsLoading(false);
            props.onSaveIssue();
          }
        });
      } else {
        IssueService.editSprintIssue(props.periodId, props.issueId, {
          name: e.target.value,
          modificationUserId: userId,
        }).then((res) => {
          if (checkResponseStatus(res)) {
            dispatch(getProjectByCode(project?.code!));
            props.onSaveIssue();
            setIsLoading(false);
          }
        });
      }
    }
  };

  const onNavigateIssue = () => {
    navigate(props.issueId);
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <Input
            suffix={isLoading ? <LoadingOutlined /> : <></>}
            ref={ref}
            className="w-100"
            value={editedValue}
            onBlur={() => {
              setEditedValue(props.initialValue);
              setIsEditing(false);
            }}
            onKeyDownCapture={(e) => {
              if (e.key === "Escape") {
                setEditedValue(props.initialValue);
                setIsEditing(false);
              }
            }}
            onChange={(e) => setEditedValue(e.target.value)}
            onPressEnter={(e) => onSaveIssue(e)}
          />
        </div>
      ) : (
        <div>
          <Tooltip title={editedValue}>
            <span className="edit-issue-name" onClick={onNavigateIssue}>
              {editedValue}
            </span>
          </Tooltip>
          {projectPermissions &&
            (projectPermissions.permissions.board.editPermission ||
              projectPermissions.permissions.backlog.editPermission) && (
              <Button
                type="text"
                className="c-backlog-edit ml-2"
                onClick={() => onEditIssue()}
              >
                <i className="fa-solid fa-pencil"></i>
              </Button>
            )}
        </div>
      )}
    </div>
  );
};

export default EditIssueInput;
