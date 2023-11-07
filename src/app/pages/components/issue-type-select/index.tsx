import { Button, Dropdown, Menu } from "antd";
import { MenuInfo } from "rc-menu/lib/interface";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import IssueType from "../issue-type";

interface IIssueTypeSelectProps {
  issueTypeKey: string;
  onChangeIssueType: (e: MenuInfo) => void;
}
export default function IssueTypeSelect(props: IIssueTypeSelectProps) {
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );

  return (
    <Dropdown
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
          {project?.issueTypes
            .filter((item) => item.name !== "Epic" && item.name !== "Subtask")
            .map((type) => {
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
