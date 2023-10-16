import {
  Button,
  Collapse,
  CollapseProps,
  Dropdown,
  Input,
  List,
  Menu,
  message,
  Popconfirm,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../../../../redux/store";
import "./index.scss";
import HeaderProject from "../header";
import { ReactNode, useState } from "react";
import CreateIssueInput from "../../../../../../components/create-issue-input";
import IssueType from "../../../../../../components/issue-type";
import SubMenu from "antd/es/menu/SubMenu";
import UserAvatar from "../../../../../../components/user-avatar";
import SelectUser from "../../../../../../components/select-user";
import EditIssueInput from "../../../../../../components/edit-issue-input";
import { ProjectService } from "../../../../../../../../services/projectService";
import { ISprint } from "../../../../../../../models/ISprint";
import { IIssue } from "../../../../../../../models/IIssue";
import { SprintService } from "../../../../../../../../services/sprintService";
import { checkResponseStatus } from "../../../../../../../helpers";
import { setSprints } from "../../../../../../../../redux/slices/projectDetailSlice";
import { IssueService } from "../../../../../../../../services/issueService";
const App: React.FC = () => {
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isCreateIssue, setIsCreateIssue] = useState<boolean>(false);
  const backlogIssues = useSelector(
    (state: RootState) => state.projectDetail.backlogIssues
  );
  const sprints = useSelector(
    (state: RootState) => state.projectDetail.sprints
  );
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const showSuccessMessage = () => {
    messageApi.open({
      type: "success",
      content: "Successfully",
    });
  };
  const onClickCreateSprint = (e: any) => {
    e.stopPropagation();
    SprintService.createSprint(project?.id!).then((res) => {
      if (checkResponseStatus(res)) {
        const tempSprint = [...sprints!];
        tempSprint.push(res?.data!);
        dispatch(setSprints(tempSprint));
        showSuccessMessage();
      }
    });
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

  const onDeleteIssue = (id: string) => {
    // IssueService.de
  };
  const onChangeAssignUser = () => {};
  const onRenderListIssue = (issues: IIssue[]) => {
    return (
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={issues}
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
                      onSaveIssue={onSaveIssue}
                      onBlurCreateIssue={onSaveIssue}
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
                        <Popconfirm
                          title="Delete"
                          description="Are you sure to delete this project?"
                          okText="Yes"
                          cancelText="Cancel"
                          onConfirm={() => onDeleteIssue(issue?.id)}
                        >
                          <div onClick={(e) => e.stopPropagation()}>
                            Move to trash
                          </div>
                        </Popconfirm>
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
    );
  };

  const onRenderBacklogContent: ReactNode = (
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
        onRenderListIssue(backlogIssues!)
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
  );

  const onRenderSprintContent = (sprint: ISprint): ReactNode => (
    <>
      {sprint?.issues?.length === 0 ? (
        <>
          <div className="c-backlog-no-content">
            <span className="text-center ">
              Plan a sprint by dragging the sprint footer down below some
              issues, or by dragging issues here.
            </span>
          </div>
        </>
      ) : (
        sprint?.issues && onRenderListIssue(sprint?.issues!)
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
  );

  return (
    <>
      <HeaderProject></HeaderProject>
      <div className="mt-4 c-backlog">
        <Collapse>
          {sprints?.map((sprint) => {
            return (
              <Collapse.Panel
                className="mb-2"
                key={sprint.id}
                header={
                  <div>
                    <span className="font-weight-bold">
                      {sprint.name}
                      <span className="font-weight-normal">
                        ({sprint?.issues?.length ?? 0}) issues
                      </span>
                    </span>
                  </div>
                }
                extra={
                  <Button
                    onClick={(e: any) => onClickCreateSprint(e)}
                    type="default"
                  >
                    Complete sprint
                  </Button>
                }
              >
                {onRenderSprintContent(sprint)}
              </Collapse.Panel>
            );
          })}

          <Collapse.Panel
            key="backlog"
            header={
              <div>
                <span className="font-weight-bold">
                  Backlog{" "}
                  <span className="font-weight-normal">
                    ({backlogIssues?.length}) issues
                  </span>
                </span>
              </div>
            }
            extra={
              <Button
                onClick={(e: any) => onClickCreateSprint(e)}
                type="default"
              >
                Create sprint
              </Button>
            }
          >
            {onRenderBacklogContent}
          </Collapse.Panel>
        </Collapse>
      </div>
      {contextHolder}
    </>
  );
};

export default App;
