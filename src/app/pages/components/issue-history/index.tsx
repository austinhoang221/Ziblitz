import { Avatar, List, Skeleton } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { IssueService } from "../../../../services/issueService";
import { checkResponseStatus } from "../../../helpers";
import { IIssueHistory } from "../../../models/IIssueHistory";
import UserAvatar from "../user-avatar";

export default function IssueHistory(props: any) {
  const [listHistory, setListHistory] = useState<IIssueHistory[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const fetchData = async () => {
    setLoading(true);
    await IssueService.getHistories(props.issueId).then((res) => {
      if (checkResponseStatus(res)) {
        setTimeout(() => {
          setListHistory(res?.data!);
          setLoading(false);
        }, 500);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, [props.issueId]);

  const onRenderContent = () => {
    if (!isLoading) {
      return (
        <List
          itemLayout="horizontal"
          dataSource={listHistory}
          renderItem={(history, index) => (
            <List.Item key={history.id}>
              <>
                <>
                  <div className="align-center d-flex">
                    <UserAvatar
                      isMultiple={false}
                      isShowName={true}
                      userIds={[history.creatorUserId]}
                    ></UserAvatar>
                    <span className="ml-2 mr-2">{history.name}</span>
                  </div>
                </>
                <span className="ml-2">
                  {dayjs(history.creationTime).format("MMM D, YYYY h:mm A")}
                </span>
              </>
            </List.Item>
          )}
        ></List>
      );
    } else {
      return (
        <Skeleton loading={isLoading} active avatar>
          <List.Item.Meta />
        </Skeleton>
      );
    }
  };

  return <>{onRenderContent()}</>;
}
