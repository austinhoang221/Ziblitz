import { blue, geekblue, gray, green } from "@ant-design/colors";
import { Button, Dropdown, Menu } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { getProjectByCode } from "../../../../redux/slices/projectDetailSlice";
import { RootState } from "../../../../redux/store";
import { IssueService } from "../../../../services/issueService";
import { useAppDispatch } from "../../../customHooks/dispatch";
import { checkResponseStatus } from "../../../helpers";
import { IIssueComponentProps } from "../../../models/IIssueComponent";
import "./index.scss";
export default function IssueStatusSelect(props: IIssueComponentProps) {
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
  const dispatch = useAppDispatch();

  const onChangeIssueStatus = async (e: any) => {
    if (props.type === "backlog") {
      await IssueService.editBacklogIssue(props.periodId, props.issueId, {
        statusId: e.key,
      }).then((res) => {
        if (checkResponseStatus(res)) {
          dispatch(getProjectByCode(project?.code!));
          props.onSaveIssue(res?.data);
        }
      });
    } else {
      await IssueService.editSprintIssue(props.periodId, props.issueId, {
        statusId: e.key,
      }).then((res) => {
        if (checkResponseStatus(res)) {
          dispatch(getProjectByCode(project?.code!));
          props.onSaveIssue(res?.data);
        }
      });
    }
  };

  const onRenderContent = () => {
    const statusName = project?.statuses.find(
      (status) => status.id === props.selectedId
    )?.name;
    switch (statusName) {
      case "DONE":
        return (
          <div>
            <Button
              style={{
                backgroundColor: green.primary,
                color: "#ffff",
                fontSize: "12px",
              }}
            >
              Done
              <i className="fa-solid fa-angle-down ml-2"></i>
            </Button>
          </div>
        );
      case "IN PROGRESS":
        return (
          <div>
            <Button
              style={{
                backgroundColor: geekblue.primary,
                color: "#ffff",
                fontSize: "12px",
              }}
            >
              Inprogress
              <i className="fa-solid fa-angle-down ml-2"></i>
            </Button>
          </div>
        );
      case "TO DO":
        return (
          <div>
            <Button
              style={{
                backgroundColor: gray.primary,
                color: "#ffff",
                fontSize: "12px",
              }}
            >
              Ready
              <i className="fa-solid fa-angle-down ml-2"></i>
            </Button>
          </div>
        );
      default:
        return (
          <div>
            <Button
              style={{
                backgroundColor: blue.primary,
                color: "#ffff",
                fontSize: "12px",
              }}
            >
              #<i className="fa-solid fa-angle-down ml-2"></i>
            </Button>
          </div>
        );
    }
  };

  return (
    <>
      <Dropdown
        trigger={["click"]}
        overlayStyle={{
          margin: "20px",
          inset: "35px auto auto 62px",
          ...props.style,
        }}
        overlay={
          <Menu onClick={(e) => onChangeIssueStatus(e)}>
            {project?.statuses
              .filter((status) => status.id !== props.issueId)
              .map((type) => {
                return (
                  <Menu.Item key={type.id}>
                    <div className="font-sz12">{type.name}</div>
                  </Menu.Item>
                );
              })}
          </Menu>
        }
      >
        {onRenderContent()}
      </Dropdown>
    </>
  );
}
