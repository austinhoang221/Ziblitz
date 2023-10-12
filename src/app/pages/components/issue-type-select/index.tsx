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
        <Menu onClick={(e) => props.onChangeIssueType(e)}>
          {project?.issueTypes.map((type) => {
            return <Menu.Item key={type.id}>{type.name}</Menu.Item>;
          })}
        </Menu>
      }
    >
      <Button type="text">
        {!props.issueTypeKey ? (
          <i className="fa-solid fa-angle-down"></i>
        ) : (
          <IssueType issueTypeKey={props.issueTypeKey}></IssueType>
        )}
      </Button>
    </Dropdown>
  );
}
