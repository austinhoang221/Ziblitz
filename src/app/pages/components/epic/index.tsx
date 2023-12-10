import { Button, Collapse, Empty, Input, InputRef } from "antd";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getProjectByCode,
  setIsShowEpic,
} from "../../../../redux/slices/projectDetailSlice";
import { RootState } from "../../../../redux/store";
import { IssueService } from "../../../../services/issueService";
import { useAppDispatch } from "../../../customHooks/dispatch";
import { checkResponseStatus } from "../../../helpers";
import { LoadingOutlined } from "@ant-design/icons";

import "./index.scss";
export default function Epic() {
  const dispatch = useAppDispatch();
  const [isCreating, setCreating] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const ref = useRef<InputRef>(null);
  const { project, projectPermissions } = useSelector(
    (state: RootState) => state.projectDetail
  );
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  const navigate = useNavigate();

  const onCloseEpic = () => {
    dispatch(setIsShowEpic(false));
  };

  const onCreateEpic = async (e: any) => {
    setLoading(true);
    await IssueService.createEpic(project?.id!, {
      name: e?.target.value,
      creatorUserId: userId,
      projectId: project?.id!,
    }).then((res) => {
      if (checkResponseStatus(res)) {
        setLoading(false);
        setCreating(false);
        dispatch(getProjectByCode(project?.code!));
      }
    });
  };

  const onViewDetailEpic = async (epicId: string) => {
    navigate(epicId);
  };
  return (
    <div className="epic">
      <div className="align-child-space-between align-center header">
        <span className="font-weight-medium">Epic</span>
        <Button type="text" onClick={() => onCloseEpic()}>
          <i className="fa-solid fa-xmark"></i>
        </Button>
      </div>

      <div className="">
        {project?.epics.length! > 0 ? (
          <Collapse ghost={true} className="m-1">
            {project?.epics?.map((epic) => (
              <Collapse.Panel
                key={epic.id}
                header={
                  <span className="font-weight-bold">{epic.name}&nbsp;</span>
                }
                className="mb-2"
              >
                <div className="mb-2">
                  <div className="font-weight-medium">Start date</div>
                  <div className="text-muted">
                    {epic.startDate
                      ? dayjs(epic.startDate).format("MMM D, YYYY")
                      : "None"}
                  </div>
                  <div className="font-weight-medium">Due date</div>
                  <div className="text-muted">
                    {epic.dueDate
                      ? dayjs(epic.dueDate).format("MMM D, YYYY")
                      : "None"}
                  </div>
                </div>
                <Button
                  type="text"
                  className=" pl-2 w-100 pr-2"
                  style={{ backgroundColor: "#f1f2f4" }}
                  onClick={() => onViewDetailEpic(epic.id)}
                >
                  <span>View all details</span>
                </Button>
              </Collapse.Panel>
            ))}
          </Collapse>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
        {projectPermissions &&
          projectPermissions.permissions.board.editPermission &&
          (!isCreating ? (
            <Button
              type="text"
              className="mr-2 w-100 mt-2"
              style={{ backgroundColor: "#f1f2f4" }}
              onClick={() => {
                setCreating(true);
                ref.current?.focus();
              }}
            >
              <i className="fa-solid fa-plus mr-2"></i>
              <span>Create epic</span>
            </Button>
          ) : (
            <Input
              ref={ref}
              onPressEnter={(e) => onCreateEpic(e)}
              onBlur={() => setCreating(false)}
              onKeyDownCapture={(e) => {
                if (e.key === "Escape") setCreating(false);
              }}
              suffix={isLoading ? <LoadingOutlined /> : <></>}
            />
          ))}
      </div>
    </div>
  );
}
