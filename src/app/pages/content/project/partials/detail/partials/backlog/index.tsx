import { Button, Collapse, CollapseProps, Dropdown, List, Menu } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../../../redux/store";
import "./index.scss";
import HeaderProject from "../header";
import { useState } from "react";
import CreateIssueInput from "../../../../../../components/create-issue-input";
import IssueType from "../../../../../../components/issue-type";
const App: React.FC = () => {
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
  const [isCreateIssue, setIsCreateIssue] = useState<boolean>(false);
  const onClickCreateSprint = (e: any) => {
    e.stopPropagation();
  };
  const onClickCreateIssue = () => {
    setIsCreateIssue(true);
  };
  const onSaveIssue = () => {
    setIsCreateIssue(false);
  };
  const backlogs: CollapseProps["items"] = [
    {
      key: "backlog",
      label: <span className="font-weight-bold">Backlog</span>,
      children: (
        <>
          {project?.backlog?.issues?.length === 0 ? (
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
              dataSource={project?.backlog?.issues}
              renderItem={(issue) => (
                <List.Item>
                  <div className="align-child-space-between align-center w-100">
                    <div className="">
                      <Button type="text">
                        <IssueType issueTypeKey="Bug"></IssueType>
                      </Button>
                      <span className="mr-2">{issue.name}</span>
                      <Button type="text">
                        <i className="fa-solid fa-pencil"></i>
                      </Button>
                    </div>
                    <Dropdown
                      overlay={
                        <Menu>
                          <Menu.Item>Copy issue link</Menu.Item>
                          <Menu.Item>Copy issue key</Menu.Item>
                          <Menu.Item>Assignee</Menu.Item>
                          <Menu.Item>Delete</Menu.Item>
                        </Menu>
                      }
                      trigger={["click"]}
                    >
                      <Button type="text" onClick={(e) => e.preventDefault()}>
                        <i className="fa-solid fa-ellipsis"></i>
                      </Button>
                    </Dropdown>
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
      <HeaderProject></HeaderProject>
      <div className="mt-4">
        <Collapse items={backlogs}></Collapse>
      </div>
    </>
  );
};

export default App;
