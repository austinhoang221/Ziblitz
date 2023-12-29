import { Button, Dropdown, Empty, Menu, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getProjectByCode } from "../../../../redux/slices/projectDetailSlice";
import { RootState } from "../../../../redux/store";
import { IssueService } from "../../../../services/issueService";
import { useAppDispatch } from "../../../customHooks/dispatch";
import { checkResponseStatus } from "../../../helpers";
import { IIssue } from "../../../models/IIssue";
interface IIssueAddParent {
  issue: IIssue;
  type: string;
  periodId: string;
  onSaveIssue: (issue?: IIssue) => void;
}
export default function IssueAddParent(props: IIssueAddParent) {
  const [issue, setIssue] = useState<IIssue | null>(null);
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;

  useEffect(() => {
    setIssue(props.issue);
  }, [props.issue]);

  const { project, projectPermissions } = useSelector(
    (state: RootState) => state.projectDetail
  );
  const dispatch = useAppDispatch();
  const onChangeField = (e: any) => {
    if (props.type === "backlog") {
      IssueService.editBacklogIssue(props?.periodId!, issue?.id!, {
        parentId: e,
        modificationUserId: userId,
      }).then((res) => {
        if (checkResponseStatus(res)) {
          dispatch(getProjectByCode(project?.code!));
          props.onSaveIssue(res?.data!);
        }
      });
    } else if (props.type === "sprint") {
      IssueService.editSprintIssue(props?.periodId!, issue?.id!, {
        parentId: e,
        modificationUserId: userId,
      }).then((res) => {
        if (checkResponseStatus(res)) {
          dispatch(getProjectByCode(project?.code!));
          props.onSaveIssue(res?.data!);
        }
      });
    }
  };

  return (
    <Tooltip
      title={!issue?.parentId ? "Add epic" : issue?.parentName ?? ""}
      className="mr-2"
    >
      <Dropdown
        disabled={
          projectPermissions !== null &&
          !projectPermissions.permissions.board.editPermission
        }
        trigger={["click"]}
        overlayStyle={{
          margin: "20px",
          inset: "35px auto auto 62px",
        }}
        overlay={
          project?.epics?.length! > 0 ? (
            <Menu
              onClick={(e) => onChangeField(e.key)}
              selectedKeys={[issue?.parentId ?? ""]}
            >
              {project?.epics.map((epic) => {
                return (
                  <Menu.Item key={epic.id}>
                    <div className="d-flex align-center">
                      <img
                        className="mr-2"
                        src={require("../../../assets/images/epic.png")}
                        alt={epic.name}
                      ></img>
                      <span className="mr-2">{epic.code}</span>
                      <span>{epic.name}</span>
                    </div>
                  </Menu.Item>
                );
              })}
            </Menu>
          ) : (
            <Menu>
              <Empty></Empty>
            </Menu>
          )
        }
      >
        {!issue?.parentId ? (
          <Button
            type="text"
            style={{
              width: "135px",
            }}
          >
            <i className="fa-solid fa-pencil mr-2"></i>
            Add Epic
          </Button>
        ) : (
          <div
            className="d-flex align-center"
            style={{
              maxWidth: "135px",
            }}
          >
            <img
              src={require("../../../assets/images/epic.png")}
              alt=""
              className="mr-2"
            />
            <span className="text-truncate">{issue?.parentName}</span>
          </div>
        )}
      </Dropdown>
    </Tooltip>
  );
}
