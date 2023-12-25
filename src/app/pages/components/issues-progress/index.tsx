import { Progress } from "antd";
import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { IIssue } from "../../../models/IIssue";
interface IIssueProgress {
  issues: IIssue[];
}
export default function IssueProgress(props: IIssueProgress) {
  const { project } = useSelector((state: RootState) => state.projectDetail);

  const onCalculatePercent = () => {
    const doneStatusCategoryId = project?.statusCategories.find(
      (category) => category.code === "Done"
    )?.id;

    const doneIssueCount = props.issues.filter(
      (issue) => issue.status.statusCategoryId === doneStatusCategoryId
    )?.length;
    if (doneIssueCount && doneIssueCount > 0) {
      return (doneIssueCount / props.issues?.length).toFixed(2);
    } else return 0;
  };

  const onCalculateDone = () => {
    const doneStatusCategoryId = project?.statusCategories.find(
      (category) => category.code === "Done"
    )?.id;

    const doneIssueCount = props.issues.filter(
      (issue) => issue.status?.statusCategoryId === doneStatusCategoryId
    )?.length;
    if (doneIssueCount && doneIssueCount > 0) {
      return doneIssueCount;
    } else return 0;
  };
  return (
    <>
      <div className="align-child-space-between align-center mb-1">
        <span>Issue</span>
        {props.issues?.length > 0 ? (
          <span className="text-muted">{` ${onCalculateDone()} of ${
            props.issues?.length
          } done`}</span>
        ) : (
          <span>No issue added</span>
        )}
      </div>
      <Progress
        percent={(onCalculatePercent() as number) * 100}
        status={
          (onCalculatePercent() as number) * 100 === 100 ? "success" : "active"
        }
      />
    </>
  );
}
