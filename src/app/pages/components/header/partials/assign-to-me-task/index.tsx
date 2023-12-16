import { List, Skeleton } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../redux/store";
import { SprintService } from "../../../../../../services/sprintService";
import { checkResponseStatus } from "../../../../../helpers";
import { IIssueOnBoard } from "../../../../../models/IProject";
import IssueType from "../../../issue-type";

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
    <div>
      {project?.statuses?.map((status, index) => {
        return !isLoading ? (
          <>
            {ordered?.[status.name].length! > 0 && (
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
                        avatar={
                          <IssueType
                            issueTypeKey={item.issueType.icon}
                          ></IssueType>
                        }
                        title={
                          <a
                            href={`/project/${item.projectCode}/backlog/${item.id}`}
                            className="text-truncate"
                          >
                            {item.name}
                          </a>
                        }
                        description={`${item.code} - ${item.projectName}`}
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
