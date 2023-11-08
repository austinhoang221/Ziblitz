import { Button, Dropdown, Empty, Menu, Tooltip } from "antd";
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
  onSaveIssue: () => void;
}
export default function IssueAddParent(props: IIssueAddParent) {
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
  const dispatch = useAppDispatch();
  const onChangeField = (type: string, e: any) => {
    if (props.type === "backlog") {
      IssueService.editBacklogIssue(props?.periodId!, props.issue.id, {
        parentId: e,
      }).then((res) => {
        if (checkResponseStatus(res)) {
          dispatch(getProjectByCode(project?.code!));
          props.onSaveIssue();
        }
      });
    } else if (props.type === "sprint") {
      IssueService.editSprintIssue(props?.periodId!, props.issue.id, {
        parentId: e,
      }).then((res) => {
        if (checkResponseStatus(res)) {
          dispatch(getProjectByCode(project?.code!));
          props.onSaveIssue();
        }
      });
    }
  };

  return (
    <Tooltip
      title={!props.issue.parentId ? "Add epic" : props.issue.parentName}
      className="mr-2"
    >
      <Dropdown
        trigger={["click"]}
        overlayStyle={{
          margin: "20px",
          inset: "35px auto auto 62px",
        }}
        overlay={
          project?.epics?.length! > 0 ? (
            <Menu
              onClick={(e) => onChangeField("parentId", e.key)}
              selectedKeys={[props.issue.parentId ?? ""]}
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
        {!props.issue.parentId ? (
          <Button type="text">
            <i className="fa-solid fa-pencil mr-2"></i>
            Add Epic
          </Button>
        ) : (
          <div className="d-flex align-center">
            <img
              src={require("../../../assets/images/epic.png")}
              alt=""
              className="mr-2"
            />
            <span className="text-truncate">{props.issue?.parentName}</span>
          </div>
        )}
      </Dropdown>
    </Tooltip>
  );
}
