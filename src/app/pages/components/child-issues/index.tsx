import { Button, Table, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import React from "react";
import { Link } from "react-router-dom";
import { IIssue } from "../../../models/IIssue";
import IssuePriority from "../issue-priority";
import IssueStatusSelect from "../issue-status-select";
import IssueType from "../issue-type";
import IssueProgress from "../issues-progress";
import UserAvatar from "../user-avatar";
import "./index.scss";
interface IChildIssuesProps {
  data: IIssue[];
}

export default function ChildIssues(props: IChildIssuesProps) {
  const columns: ColumnsType<IIssue> = [
    {
      title: "",
      key: "img",
      width: "50px",
      align: "center",
      render: (issue: IIssue) => {
        return <IssueType issueTypeKey={issue?.issueType?.icon}></IssueType>;
      },
    },
    {
      title: "",
      key: "code",
      width: "15%",
      align: "left",
      render: (issue: IIssue) => {
        return (
          <Link to={issue.id} className="ml-2">
            {issue.code}
          </Link>
        );
      },
    },
    {
      title: "",
      key: "name",
      width: "auto",
      align: "left",
      render: (issue: IIssue) => {
        return (
          <Tooltip title={issue.code}>
            <span>{issue.name}</span>
          </Tooltip>
        );
      },
    },
    {
      title: "",
      key: "priority",
      width: "4%",
      align: "center",
      render: (issue: IIssue) => {
        return <IssuePriority priorityId={issue.priorityId!}></IssuePriority>;
      },
    },
    {
      title: "",
      key: "storyPointEstimate",
      width: "4%",
      align: "center",
      render: (issue: IIssue) => {
        return (
          <Button type="text" shape="circle">
            {issue?.issueDetail?.storyPointEstimate ?? 0}
          </Button>
        );
      },
    },
    {
      title: "",
      key: "assigneeId",
      width: "6%",
      align: "center",
      render: (issue: IIssue) => {
        return (
          <UserAvatar
            isMultiple={false}
            isShowName={false}
            userIds={[issue?.issueDetail?.assigneeId]}
          ></UserAvatar>
        );
      },
    },
    {
      title: "",
      key: "statusId",
      width: "15%",
      align: "center",
      render: (issue: IIssue) => {
        return (
          <IssueStatusSelect
            type={
              issue?.backlogId ? "backlog" : issue?.sprintId ? "sprint" : "epic"
            }
            selectedId={issue?.status?.id!}
            periodId={issue?.sprintId ?? issue?.backlogId!}
            issueId={issue?.id!}
            style={{ width: "120px", minWidth: "120px" }}
            onSaveIssue={() => {}}
          ></IssueStatusSelect>
        );
      },
    },
  ];
  return (
    <div className="child-issue">
      <IssueProgress issues={props?.data ?? []}></IssueProgress>
      <Table
        pagination={false}
        className="mt-2"
        columns={columns}
        dataSource={props.data}
      ></Table>
    </div>
  );
}
