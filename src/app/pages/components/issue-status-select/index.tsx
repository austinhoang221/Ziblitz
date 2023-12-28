import { blue, geekblue, gray, green } from "@ant-design/colors";
import { Button, Dropdown, Menu } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getProjectByCode } from "../../../../redux/slices/projectDetailSlice";
import { RootState } from "../../../../redux/store";
import { IssueService } from "../../../../services/issueService";
import { StatusService } from "../../../../services/statusService";
import { useAppDispatch } from "../../../customHooks/dispatch";
import { checkResponseStatus } from "../../../helpers";
import { IIssueComponentProps } from "../../../models/IIssueComponent";
import { IStatusCategory } from "../../../models/IStatusCategory";
import "./index.scss";
export default function IssueStatusSelect(props: IIssueComponentProps) {
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
  const dispatch = useAppDispatch();
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  const [statusCategories, setStatusCategories] = useState<IStatusCategory[]>(
    []
  );

  useEffect(() => {
    StatusService.getCategories().then((res) => {
      if (checkResponseStatus(res)) {
        setStatusCategories(res?.data!);
      }
    });
  }, []);

  const onChangeIssueStatus = async (e: any) => {
    if (props.type === "backlog") {
      await IssueService.editBacklogIssue(props.periodId, props.issueId, {
        statusId: e.key,
        modificationUserId: userId,
      }).then((res) => {
        if (checkResponseStatus(res)) {
          dispatch(getProjectByCode(project?.code!));
          props.onSaveIssue(res?.data);
        }
      });
    } else {
      await IssueService.editSprintIssue(props.periodId, props.issueId, {
        statusId: e.key,
        modificationUserId: userId,
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
              {statusName}
              <i className="fa-solid fa-angle-down ml-2"></i>
            </Button>
          </div>
        );
    }
  };

  const onRenderSelect = () => {
    const statusCategoryId = project?.statuses.find(
      (status) => status.id === props.selectedId
    )?.statusCategoryId;

    const statusCategoryCode = statusCategories.find(
      (category) => category.id === statusCategoryId
    )?.code;

    const todoCategoryId = statusCategories.find(
      (category) => category.code === "To-do"
    )?.id;
    const inProgressCategoryId = statusCategories.find(
      (category) => category.code === "In-Progress"
    )?.id;
    const doneCategoryId = statusCategories.find(
      (category) => category.code === "Done"
    )?.id;

    switch (statusCategoryCode) {
      case "To-do":
        return (
          <>
            {project?.statuses
              .filter(
                (status) =>
                  status.id !== props.issueId &&
                  status.statusCategoryId !== doneCategoryId &&
                  status.statusCategoryId !== todoCategoryId
              )
              .map((type) => {
                return (
                  <Menu.Item key={type.id}>
                    <div className="font-sz12">{type.name}</div>
                  </Menu.Item>
                );
              })}
          </>
        );
      case "In-Progress":
        return (
          <>
            {project?.statuses
              .filter((status) => status.id !== props.issueId)
              .map((type) => {
                return (
                  <Menu.Item key={type.id}>
                    <div className="font-sz12">{type.name}</div>
                  </Menu.Item>
                );
              })}
          </>
        );
      case "Done":
        return (
          <>
            {project?.statuses
              .filter(
                (status) =>
                  status.id !== props.issueId &&
                  status.statusCategoryId !== inProgressCategoryId
              )
              .map((type) => {
                return (
                  <Menu.Item key={type.id}>
                    <div className="font-sz12">{type.name}</div>
                  </Menu.Item>
                );
              })}
          </>
        );
    }
  };

  return (
    <Dropdown
      trigger={["click"]}
      overlayStyle={{
        margin: "20px",
        inset: "35px auto auto 62px",
        ...props.style,
      }}
      overlay={
        <Menu
          onClick={(e) => onChangeIssueStatus(e)}
          selectedKeys={[props.selectedId.toString() ?? ""]}
        >
          {onRenderSelect()}
        </Menu>
      }
    >
      {onRenderContent()}
    </Dropdown>
  );
}
