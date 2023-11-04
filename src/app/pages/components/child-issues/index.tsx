import { Button, Table, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import React from "react";
import { IIssue } from "../../../models/IIssue";
import IssuePriority from "../issue-priority";
import IssueStatusSelect from "../issue-status-select";
import IssueType from "../issue-type";
import UserAvatar from "../user-avatar";
interface IChildIssuesProps {
  data: IIssue[];
}

export default function ChildIssues(props: IChildIssuesProps) {
  const columns: ColumnsType<IIssue> = [
    {
      title: "",
      key: "img",
      width: "40px",
      align: "center",
      render: (issue: IIssue) => {
        return <IssueType issueTypeKey={issue?.issueType.name}></IssueType>;
      },
    },
    {
      title: "",
      key: "name",
      width: "auto",
      align: "center",
      render: (issue: IIssue) => {
        return (
          <Tooltip title={issue.code}>
            <span className="text-truncate">{issue.name}</span>
          </Tooltip>
        );
      },
    },
    {
      title: "",
      key: "priority",
      width: "auto",
      align: "center",
      render: (issue: IIssue) => {
        return <IssuePriority priorityId={issue.priorityId!}></IssuePriority>;
      },
    },
    {
      title: "",
      key: "storyPointEstimate",
      width: "auto",
      align: "center",
      render: (issue: IIssue) => {
        return (
          <Button type="text" shape="circle">
            {issue?.issueDetail.storyPointEstimate ?? 0}
          </Button>
        );
      },
    },
    {
      title: "",
      key: "assigneeId",
      width: "auto",
      align: "center",
      render: (issue: IIssue) => {
        return (
          <UserAvatar
            isMultiple={false}
            isShowName={false}
            userIds={[issue?.issueDetail.assigneeId]}
          ></UserAvatar>
        );
      },
    },
    {
      title: "",
      key: "statusId",
      width: "auto",
      align: "center",
      render: (issue: IIssue) => {
        return (
          <IssueStatusSelect
            type={
              issue?.backlogId ? "backlog" : issue?.sprintId ? "sprint" : "epic"
            }
            selectedId={issue?.statusId!}
            periodId={issue?.sprintId ?? issue?.backlogId!}
            issueId={issue?.id!}
            style={{ width: "120px", minWidth: "120px" }}
            onSaveIssue={() => {}}
          ></IssueStatusSelect>
        );
      },
    },
  ];
  return <Table columns={columns} dataSource={props.data}></Table>;
}
