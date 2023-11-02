import { List, Skeleton } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { IIssue } from "../../../models/IIssue";
import InlineEdit from "../inline-edit";
import UserAvatar from "../user-avatar";

interface IInlineEditProps {
  periodType: string;
  initialValue: string | null;
  periodId: string;
  issue: IIssue;
  onSaveIssue: () => void;
}

export default function IssueComment(props: IInlineEditProps) {
  const [isLoading, setLoading] = useState<boolean>(false);

  const onRenderContent = () => {
    if (!isLoading) {
      return (
        // <List
        //   itemLayout="horizontal"
        //   dataSource={listHistory}
        //   renderItem={(history, index) => (
        //     <List.Item key={history.id}>
        //       <>
        //         <>
        //           <div className="align-center d-flex">
        //             <UserAvatar
        //               isMultiple={false}
        //               isShowName={true}
        //               userIds={[history.creatorUserId]}
        //             ></UserAvatar>
        //             <span className="ml-2 mr-2">{history.name}</span>
        //           </div>
        //         </>
        //         <span className="ml-2">
        //           {dayjs(history.creationTime).format("MMM D, YYYY h:mm A")}
        //         </span>
        //       </>
        //     </List.Item>
        //   )}
        // ></List>
        <></>
      );
    } else {
      return (
        <Skeleton loading={isLoading} active avatar>
          <List.Item.Meta />
        </Skeleton>
      );
    }
  };

  return (
    <>
      <InlineEdit
        periodType={
          props.issue?.backlogId
            ? "backlog"
            : props.issue?.sprintId
            ? "sprint"
            : "epic"
        }
        periodId={props.issue?.sprintId ?? props.issue?.backlogId!}
        initialValue={props.issue?.description ?? "Add a description..."}
        type="textarea"
        issueId={props.issue?.id}
        fieldName="comment"
        onSaveIssue={props.onSaveIssue}
      ></InlineEdit>

      {onRenderContent()}
    </>
  );
}
