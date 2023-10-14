import {
  Button,
  Collapse,
  CollapseProps,
  Dropdown,
  Input,
  List,
  Menu,
  message,
} from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../../../redux/store";
import "./index.scss";
import HeaderProject from "../header";
import { useState } from "react";
import CreateIssueInput from "../../../../../../components/create-issue-input";
import IssueType from "../../../../../../components/issue-type";
import SubMenu from "antd/es/menu/SubMenu";
import UserAvatar from "../../../../../../components/user-avatar";
import SelectUser from "../../../../../../components/select-user";
import InlineEdit from "../../../../../../components/edit-issue-input";
import EditIssueInput from "../../../../../../components/edit-issue-input";
const App: React.FC = () => {
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isCreateIssue, setIsCreateIssue] = useState<boolean>(false);
  const backlogIssues = useSelector(
    (state: RootState) => state.projectDetail.backlogIssues
  );
  const [messageApi, contextHolder] = message.useMessage();

  const showSuccessMessage = () => {
    messageApi.open({
      type: "success",
      content: "Successfully",
    });
  };
  const onClickCreateSprint = (e: any) => {
    e.stopPropagation();
  };
  const onClickCreateIssue = () => {
    setIsCreateIssue(true);
  };

  const onEditIssue = () => {
    setIsEditing(true);
  };
  const onSaveIssue = () => {
    setIsCreateIssue(false);
    showSuccessMessage();
  };

  const onDeleteIssue = (id: string) => {};
  const onChangeAssignUser = () => {};
  const backlogs: CollapseProps["items"] = [
    {
      key: "backlog",
      label: (
        <div>
          <span className="font-weight-bold">
            Backlog{" "}
            <span className="font-weight-normal">
              ({backlogIssues?.length}) issues
            </span>
          </span>
        </div>
      ),
      children: (
        <>
          {backlogIssues?.length === 0 ? (
            <>
              <div className="c-backlog-no-content">
                <span className="text-center ">
                  Plan and pritoritize your future work in backlog
                </span>
              </div>
            </>
          ) : (
            <List
              className="demo-loadmore-list"
              itemLayout="horizontal"
              dataSource={backlogIssues!}
              renderItem={(issue) => (
                <List.Item className="c-backlog-item">
                  <div className="align-child-space-between align-center w-100">
                    <div className="d-flex align-center">
                      <Button type="text" className="mr-2">
                        <IssueType
                          issueTypeKey={
                            project?.issueTypes.find(
                              (type) => type.id === issue.issueTypeId
                            )?.name
                          }
                        ></IssueType>
                      </Button>
                      {isEditing ? (
                        <Input placeholder="What need to be done?"></Input>
                      ) : (
                        <>
                          <EditIssueInput
                            initialValue={issue.name}
                            identifier={issue.id}
                          ></EditIssueInput>
                        </>
                      )}
                    </div>
                    <div>
                      <UserAvatar
                        userIds={[issue?.assigneeId]}
                        isMultiple={false}
                        isShowName={true}
                      ></UserAvatar>
                      <Dropdown
                        className="c-backlog-action"
                        overlay={
                          <Menu>
                            <Menu.Item>Copy issue link</Menu.Item>
                            <Menu.Item>Copy issue key</Menu.Item>
                            <SubMenu title={"Assignee"}>
                              <Menu.Item>
                                <SelectUser
                                  onChangeAssignUser={onChangeAssignUser}
                                ></SelectUser>
                              </Menu.Item>
                            </SubMenu>
                            <Menu.Item onClick={() => onDeleteIssue(issue.id)}>
                              Delete
                            </Menu.Item>
                          </Menu>
                        }
                        trigger={["click"]}
                      >
                        <Button type="text" onClick={(e) => e.preventDefault()}>
                          <i className="fa-solid fa-ellipsis"></i>
                        </Button>
                      </Dropdown>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          )}
          {!isCreateIssue ? (
            <Button
              type="text"
              className="w-100 mt-1 text-left"
              onClick={onClickCreateIssue}
            >
              <i className="fa-solid fa-plus mr-2"></i>
              <span className="font-weight-bold">Add upcoming work here</span>
            </Button>
          ) : (
            <div className="mt-1">
              <CreateIssueInput
                periodId={project?.backlog?.id}
                onSaveIssue={onSaveIssue}
                onBlurCreateIssue={onSaveIssue}
              ></CreateIssueInput>
            </div>
          )}
        </>
      ),
      extra: (
        <Button onClick={(e: any) => onClickCreateSprint(e)} type="default">
          Create sprint
        </Button>
      ),
    },
  ];
  return (
    <>
      {contextHolder}
      <HeaderProject></HeaderProject>
      <div className="mt-4 c-backlog">
        <Collapse items={backlogs}></Collapse>
      </div>
    </>
  );
};

export default App;
