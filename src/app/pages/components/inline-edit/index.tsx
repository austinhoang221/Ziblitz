import { Avatar, Button, DatePicker, Input, InputNumber } from "antd";
import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { useSelector } from "react-redux";
import { getProjectByCode } from "../../../../redux/slices/projectDetailSlice";
import { RootState } from "../../../../redux/store";
import { IssueService } from "../../../../services/issueService";
import { useAppDispatch } from "../../../customHooks/dispatch";
import {
  checkResponseStatus,
  convertNameToInitials,
  getRandomColor,
} from "../../../helpers";
import SelectUser from "../select-user";
import SprintSelect from "../sprint-select";
import "react-quill/dist/quill.snow.css";

import "./index.scss";
import dayjs from "dayjs";
import { IIssue } from "../../../models/IIssue";
interface IInlineEditProps {
  type: string;
  periodType: string;
  initialValue: any;
  issueId: string;
  periodId: string;
  fieldName: string;
  disabledDate?: any;
  onSaveIssue: (issue?: IIssue) => void;
}
export default function InlineEdit(props: IInlineEditProps) {
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
  const users = useSelector((state: RootState) => state.users);
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState<any>(props.initialValue);
  const dispatch = useAppDispatch();
  const ref = useRef<any>(null);
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  useEffect(() => {
    if (isEditing) {
      ref.current?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditedValue(props.initialValue);
  }, [props.initialValue]);
  const onEdit = () => {
    setIsEditing(true);
  };

  const onSave = () => {
    if (
      editedValue !== null &&
      editedValue !== "" &&
      editedValue !== props.initialValue
    ) {
      if (props.type === "backlog") {
        IssueService.editBacklogIssue(props.periodId, props.issueId, {
          [props.fieldName]: editedValue,
        }).then((res) => {
          if (checkResponseStatus(res)) {
            dispatch(getProjectByCode(project?.code!));
            setIsEditing(false);
            props.onSaveIssue(res?.data);
          }
        });
      } else if (props.type === "sprint") {
        IssueService.editSprintIssue(props.periodId, props.issueId, {
          [props.fieldName]: editedValue,
        }).then((res) => {
          if (checkResponseStatus(res)) {
            dispatch(getProjectByCode(project?.code!));
            setIsEditing(false);
            props.onSaveIssue(res?.data);
          }
        });
      } else {
        IssueService.updateEpic(project?.id!, props.issueId, {
          [props.fieldName]: editedValue,
        }).then((res) => {
          if (checkResponseStatus(res)) {
            dispatch(getProjectByCode(project?.code!));
            setIsEditing(false);
            props.onSaveIssue(res?.data);
          }
        });
      }
    } else {
      setIsEditing(false);
    }
  };
  const onRenderInput = () => {
    switch (props.type) {
      case "input":
        return (
          <Input
            ref={ref}
            className="w-100"
            value={editedValue}
            onKeyDownCapture={(e) => {
              if (e.key === "Escape") {
                setEditedValue(props.initialValue);
                setIsEditing(false);
              }
            }}
            onChange={(e) => setEditedValue(e.target.value)}
            onBlur={onSave}
            onPressEnter={onSave}
          />
        );

      case "textarea":
        return (
          <>
            <ReactQuill
              ref={ref}
              className="mt-2"
              theme="snow"
              value={editedValue ?? ""}
              onChange={setEditedValue}
            />
            <Button type="primary" onClick={onSave}>
              Save
            </Button>
            <Button
              type="default"
              className="ml-2 mt-2 mb-2"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </>
        );
      case "assigneeSelect":
      case "reporterSelect":
        return (
          <>
            <SelectUser
              fieldName={props.fieldName}
              type={props.type}
              periodId={props.periodId}
              onSaveIssue={(e) => props.onSaveIssue(e)}
              issueId={props.issueId}
              selectedId={props.initialValue!}
              onBlur={() => setIsEditing(false)}
            ></SelectUser>
          </>
        );
      case "sprintSelect":
        return (
          <>
            <SprintSelect
              className="w-100"
              type={props.type}
              periodId={props.periodId}
              onSaveIssue={props.onSaveIssue}
              issueId={props.issueId}
              selectedId={props.initialValue!}
              onBlur={() => setIsEditing(false)}
            ></SprintSelect>
          </>
        );
      case "storyPointEstimate":
        return (
          <>
            <InputNumber
              className="w-100"
              min={"0"}
              max={"10"}
              ref={ref}
              value={props.initialValue ?? "0"}
              onChange={(e) => setEditedValue(e)}
              onPressEnter={onSave}
              onBlur={onSave}
            ></InputNumber>
          </>
        );
      case "date":
        const currentDate = new Date();
        return (
          <DatePicker
            className="w-100"
            ref={ref}
            defaultValue={
              props.initialValue
                ? dayjs(props.initialValue)
                : dayjs(currentDate)
            }
            value={editedValue ? dayjs(editedValue) : null}
            onChange={(e, string) => setEditedValue(string)}
            onBlur={onSave}
            disabledDate={props.disabledDate}
          />
        );
    }
  };

  const onRenderContent = () => {
    switch (props.type) {
      case "assigneeSelect":
      case "reporterSelect":
        return (
          <>
            {editedValue && (
              <div
                className={
                  "edit-content" +
                  (props.fieldName === "name"
                    ? " font-sz24 font-weight-medium"
                    : "")
                }
                onClick={onEdit}
              >
                <Avatar
                  style={{
                    backgroundColor: getRandomColor(),
                    verticalAlign: "middle",
                  }}
                  size={28}
                  className="mr-2"
                  alt=""
                  src={users.find((user) => user.id === editedValue)?.avatarUrl}
                >
                  {convertNameToInitials(
                    users.find((user) => user.id === editedValue)?.name ?? ""
                  )}
                </Avatar>
                <span>
                  {users.find((user) => user.id === editedValue)?.name}
                </span>
              </div>
            )}
          </>
        );
      case "date":
        return (
          <div
            className={
              "edit-content" +
              (props.fieldName === "name"
                ? " font-sz24 font-weight-medium"
                : "")
            }
            onClick={onEdit}
          >
            <span className="ml-2" style={{ width: "200px" }}>
              {editedValue ? dayjs(editedValue).format("MMM D, YYYY") : "None"}
            </span>
          </div>
        );
      case "textarea":
        return (
          <div
            className={
              "edit-content" +
              (props.fieldName === "name"
                ? " font-sz24 font-weight-medium"
                : "")
            }
            onClick={onEdit}
          >
            <span className="ml-2">
              <div dangerouslySetInnerHTML={{ __html: editedValue ?? "" }} />
            </span>
          </div>
        );
      case "input":
      default:
        return (
          <div
            className={
              "edit-content" +
              (props.fieldName === "name"
                ? " font-sz24 font-weight-medium"
                : "")
            }
            onClick={onEdit}
          >
            <span className="ml-2" style={{ width: "200px" }}>
              {editedValue ?? "None"}
            </span>
          </div>
        );
    }
  };
  return (
    <div>
      {isEditing ? (
        <div>{onRenderInput()}</div>
      ) : (
        <>
          {onRenderContent()}

          {props.type === "assigneeSelect" && userId !== editedValue && (
            <Button
              type="link"
              style={{ paddingLeft: "11px" }}
              onClick={() => {
                setEditedValue(userId);
                onSave();
              }}
            >
              Assign to me
            </Button>
          )}
        </>
      )}
    </div>
  );
}
