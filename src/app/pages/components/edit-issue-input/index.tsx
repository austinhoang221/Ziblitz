import React, { useEffect, useRef, useState } from "react";
import { Typography, Input, Button, InputRef } from "antd";
import { IssueService } from "../../../../services/issueService";
import { checkResponseStatus } from "../../../helpers";
import { useDispatch, useSelector } from "react-redux";
import { setBacklogIssues } from "../../../../redux/slices/projectDetailSlice";
import { RootState } from "../../../../redux/store";
import { IIssue } from "../../../models/IIssue";

const { Text } = Typography;

const EditIssueInput = (props: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(props.initialValue);
  const dispatch = useDispatch();
  const ref = useRef<InputRef>(null);
  const backlogIssues = useSelector(
    (state: RootState) => state.projectDetail.backlogIssues
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
    if (e) {
      IssueService.editBacklogIssue(props.periodId, props.identifier, {
        name: e.target.value,
      }).then((res) => {
        if (checkResponseStatus(res)) {
          const tempBacklogIssues: IIssue[] = [...backlogIssues!];
          const index = tempBacklogIssues.findIndex(
            (item: IIssue) => item.id === res?.data.id
          );
          tempBacklogIssues.splice(index, 1, res?.data!);
          props.onSaveIssue();
          dispatch(setBacklogIssues(tempBacklogIssues!));
        }
      });
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
            onBlur={() => setIsEditing(false)}
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
