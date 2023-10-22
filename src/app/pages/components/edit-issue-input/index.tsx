import React, { useEffect, useRef, useState } from "react";
import { Typography, Input, Button, InputRef } from "antd";
import { IssueService } from "../../../../services/issueService";
import { checkResponseStatus } from "../../../helpers";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../customHooks/dispatch";
import { getProjectByCode } from "../../../../redux/slices/projectDetailSlice";
import { RootState } from "../../../../redux/store";

const { Text } = Typography;

const EditIssueInput = (props: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(props.initialValue);
  const dispatch = useAppDispatch();
  const ref = useRef<InputRef>(null);
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );

  useEffect(() => {
    if (isEditing) {
      ref.current?.focus();
    }
  }, [isEditing]);

  const onEditIssue = () => {
    setIsEditing(true);
  };

  const onSaveIssue = (e: any) => {
    if (e?.target.value) {
      if (props.type === "backlog") {
        IssueService.editBacklogIssue(props.periodId, props.identifier, {
          name: e.target.value,
        }).then((res) => {
          if (checkResponseStatus(res)) {
            dispatch(getProjectByCode(project?.code!));
            props.onSaveIssue();
          }
        });
      } else {
        IssueService.editSprintIssue(props.periodId, props.identifier, {
          name: e.target.value,
        }).then((res) => {
          if (checkResponseStatus(res)) {
            dispatch(getProjectByCode(project?.code!));
            props.onSaveIssue();
          }
        });
      }
    }
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <Input
            ref={ref}
            className="w-100"
            value={editedValue}
            // onBlur={() => {
            //   setEditedValue(props.initialValue);
            //   setIsEditing(false);
            // }}
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
          <Text>{editedValue}</Text>
          <Button
            type="text"
            className="c-backlog-edit ml-2"
            onClick={() => onEditIssue()}
          >
            <i className="fa-solid fa-pencil"></i>
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditIssueInput;
