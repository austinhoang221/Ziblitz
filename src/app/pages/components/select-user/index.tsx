import { Select } from "antd";
import { BaseSelectRef } from "rc-select";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getProjectByCode } from "../../../../redux/slices/projectDetailSlice";
import { RootState } from "../../../../redux/store";
import { IssueService } from "../../../../services/issueService";
import { useAppDispatch } from "../../../customHooks/dispatch";
import useUserData from "../../../customHooks/fetchUser";
import { checkResponseStatus } from "../../../helpers";
import { IIssueComponentProps } from "../../../models/IIssueComponent";
import { IUser } from "../../../models/IUser";

interface ISelectUserProps extends IIssueComponentProps {
  fieldName: string;
}
export default function SelectUser(props: ISelectUserProps) {
  const initialRequestUserParam = {
    name: "",
  };
  const [requestUserParam, setRequestUserParam] = useState(
    initialRequestUserParam
  );
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  const { listUser, isLoadingUser: loading } = useUserData(
    userId,
    requestUserParam.name
  );
  const dispatch = useAppDispatch();
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );

  const ref = useRef<BaseSelectRef>(null);
  useEffect(() => {
    ref?.current?.focus();
  });
  const getOptionLabel = (user: IUser) => (
    <>
      {/* <Avatar
        style={{ backgroundColor: getRandomColor(), verticalAlign: "middle" }}
        size={28}
        className="mr-2"
        alt=""
        src={user.avatarUrl}
      >
        {convertNameToInitials(user.name)}
      </Avatar> */}
      <span>{user.name}</span>
    </>
  );

  const onSearch = (value?: string) => {
    setRequestUserParam({ name: value! });
  };

  const onChangeAssignUser = async (e: any) => {
    if (props.type === "backlog") {
      await IssueService.editBacklogIssue(props.periodId, props.issueId, {
        [props.fieldName]: e,
      }).then((res) => {
        if (checkResponseStatus(res)) {
          dispatch(getProjectByCode(project?.code!));
          props.onSaveIssue(res?.data);
        }
      });
    } else {
      await IssueService.editSprintIssue(props.periodId, props.issueId, {
        [props.fieldName]: e,
      }).then((res) => {
        if (checkResponseStatus(res)) {
          dispatch(getProjectByCode(project?.code!));
          props.onSaveIssue(res?.data);
        }
      });
    }
  };

  return (
    <>
      <Select
        style={{ width: "150px" }}
        showSearch
        ref={ref}
        onSearch={(e) => onSearch(e)}
        loading={loading}
        defaultValue={props.selectedId}
        options={listUser.map((user) => {
          return {
            label: getOptionLabel(user),
            value: user.id,
          };
        })}
        onChange={(e) => onChangeAssignUser(e)}
        onFocus={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        onBlur={props.onBlur}
      ></Select>
    </>
  );
}
