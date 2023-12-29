import { List, Skeleton, Tooltip } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../redux/store";
import { SprintService } from "../../../../../../services/sprintService";
import { checkResponseStatus } from "../../../../../helpers";
import { IIssueOnBoard } from "../../../../../models/IProject";
import IssuePriority from "../../../issue-priority";
import IssueType from "../../../issue-type";
import "./index.scss";

export default function AssignToMeTask() {
  const [ordered, setOrdered] = useState<IIssueOnBoard>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { project } = useSelector((state: RootState) => state.projectDetail);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const payload = {
      epicIds: [],
      issueTypeIds: [],
      sprintIds: [],
      searchKey: "",
    };
    await SprintService.getAllIssue(project?.id!, payload).then((res) => {
      if (checkResponseStatus(res)) {
        setOrdered(res?.data!);
        setIsLoading(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id]);

  useEffect(() => {
    if (project?.id) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id]);

  return (
    <div
      className="assign-to-me"
      style={{ maxHeight: "20rem", overflow: "hidden scroll" }}
    >
      {project?.statuses?.map((status, index) => {
        return !isLoading ? (
          <>
            {ordered?.[status.name]?.length! > 0 && (
              <>
                <span
                  className="mt-2 mb-2 font-weight-bold font-sz12"
                  style={{ color: "#1677FF" }}
                >
                  {status.name}
                </span>
                <List
                  itemLayout="horizontal"
                  dataSource={ordered?.[status.name]}
                  renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta
                        className="text-truncate"
                        avatar={
                          <IssueType
                            issueTypeKey={item.issueType.icon}
                          ></IssueType>
                        }
                        title={
                          <Tooltip title={item.name}>
                            <a
                              href={`/project/${item.projectCode}/backlog/${item.id}`}
                              className="text-truncate"
                            >
                              {item.name}
                            </a>
                          </Tooltip>
                        }
                        description={
                          <span>
                            {item.code}
                            &nbsp;
                            <IssuePriority
                              priorityId={item.priorityId ?? ""}
                            ></IssuePriority>
                          </span>
                        }
                      />
                    </List.Item>
                  )}
                />
              </>
            )}
          </>
        ) : (
          <Skeleton loading={isLoading} active avatar>
            <List.Item.Meta />
          </Skeleton>
        );
      })}
    </div>
  );
}
