import { Select } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getProjectByCode } from "../../../../redux/slices/projectDetailSlice";
import { RootState } from "../../../../redux/store";
import { IssueService } from "../../../../services/issueService";
import { useAppDispatch } from "../../../customHooks/dispatch";
import { checkResponseStatus } from "../../../helpers";
import { IIssueComponentProps } from "../../../models/IIssueComponent";
import { IStatus } from "../../../models/IStatus";

export default function IssueStatusSelect(props: IIssueComponentProps) {
  const [listStatus, setListStatus] = useState<IStatus[]>([]);
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    getStatusOptions();
  }, []);

  const onChangeIssueStatus = async (e: any) => {
    if (props.type === "backlog") {
      await IssueService.editBacklogIssue(props.periodId, e, {
        statusId: e,
      }).then((res) => {
        if (checkResponseStatus(res)) {
          dispatch(getProjectByCode(project?.code!));
          props.onSaveIssue();
        }
      });
    } else {
      await IssueService.editSprintIssue(props.periodId, e, {
        statusId: e,
      }).then((res) => {
        if (checkResponseStatus(res)) {
          dispatch(getProjectByCode(project?.code!));
          props.onSaveIssue();
        }
      });
    }
  };

  const getStatusOptions: () => void = () => {
    setListStatus(
      project?.statuses.filter((status) => status.id !== props.currentId)!
    );
  };

  return (
    <>
      <Select
        className="mr-2"
        style={{ maxWidth: "100px" }}
        defaultValue={props.currentId}
        onChange={(e) => onChangeIssueStatus(e)}
        options={listStatus.map((status) => {
          return {
            label: status.name,
            key: status.id,
            value: status.id,
          };
        })}
      />
    </>
  );
}
