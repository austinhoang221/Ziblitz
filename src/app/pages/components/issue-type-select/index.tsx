import { Button, Dropdown, Menu } from "antd";
import { MenuInfo } from "rc-menu/lib/interface";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import IssueType from "../issue-type";

interface IIssueTypeSelectProps {
  issueTypeKey: string;
  isSubtask?: boolean;
  onChangeIssueType: (e: MenuInfo) => void;
}
export default function IssueTypeSelect(props: IIssueTypeSelectProps) {
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );

  const getIssueType = () => {
    if (props.isSubtask) {
      return project?.issueTypes.filter((item) => item.name === "Subtask");
    } else {
      return project?.issueTypes.filter(
        (item) => item.name !== "Epic" && item.name !== "Subtask"
      );
    }
  };

  return (
    <Dropdown
      disabled={props.isSubtask}
      trigger={["click"]}
      className="mr-2"
      overlay={
        <Menu
          onClick={(e) => props.onChangeIssueType(e)}
          selectedKeys={[
            project?.issueTypes.find((type) => type.icon === props.issueTypeKey)
              ?.id ?? "",
          ]}
        >
          {(getIssueType() ?? []).map((type) => {
            return (
              <Menu.Item key={type.id}>
                <div>{type.name}</div>
              </Menu.Item>
            );
          })}
        </Menu>
      }
    >
      <Button
        type="text"
        size="small"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {!props.issueTypeKey ? (
          <i className="fa-solid fa-angle-down"></i>
        ) : (
          <IssueType issueTypeKey={props.issueTypeKey}></IssueType>
        )}
      </Button>
    </Dropdown>
  );
}
