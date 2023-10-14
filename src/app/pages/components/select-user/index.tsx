import { Avatar, Select } from "antd";
import React, { useState } from "react";
import useUserData from "../../../customHooks/fetchUser";
import { convertNameToInitials, getRandomColor } from "../../../helpers";
import { IUser } from "../../../models/IUser";

export default function SelectUser(props: any) {
  const initialRequestUserParam = {
    name: "",
  };
  const [requestUserParam, setRequestUserParam] = useState(
    initialRequestUserParam
  );
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  const { listUser, loading } = useUserData(userId, requestUserParam.name);

  const getOptionLabel = (user: IUser) => (
    <>
      <Avatar
        style={{ backgroundColor: getRandomColor(), verticalAlign: "middle" }}
        size={28}
        className="mr-2"
        alt=""
        src={user.avatarUrl}
      >
        {convertNameToInitials(user.name)}
      </Avatar>
      <span>{user.name}</span>
    </>
  );

  const onSearch = (value?: string) => {
    setRequestUserParam({ name: value! });
  };

  return (
    <Select
      style={{ width: "200px" }}
      showSearch
      onSearch={(e) => onSearch(e)}
      loading={loading}
      options={listUser.map((user) => {
        return {
          label: getOptionLabel(user),
          value: user.id,
        };
      })}
      onChange={props.onChangeAssignUser}
      onFocus={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    ></Select>
  );
}
