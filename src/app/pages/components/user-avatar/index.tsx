import { Avatar, Divider, Tooltip } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../../../redux/store";
import { sasToken } from "../../../helpers";
import { IUser } from "../../../models/IUser";
import { UserOutlined } from "@ant-design/icons";

interface IUserAvatarProps {
  userIds: string[];
  isMultiple: boolean;
  isShowName: boolean;
  className?: string;
}
export default function UserAvatar(props: IUserAvatarProps) {
  const users: IUser[] = useSelector((state: RootState) => state.users);
  if (props.isMultiple) {
    return (
      <>
        <Avatar.Group
          maxCount={4}
          maxStyle={{
            color: "#f56a00",
            backgroundColor: "#fde3cf",
            cursor: "pointer",
          }}
        >
          {users.map((user) => {
            return (
              <>
                {user.avatarUrl ? (
                  <Avatar src={user.avatarUrl + sasToken} />
                ) : (
                  <Avatar icon={<UserOutlined />} />
                )}

                {props.isShowName ?? <Link to="">{user.name}</Link>}
              </>
            );
          })}
        </Avatar.Group>
      </>
    );
  } else {
    return (
      <>
        {users?.find((user) => user.id === props?.userIds[0])?.avatarUrl ? (
          <Avatar
            src={
              users.find((user) => user.id === props.userIds[0])?.avatarUrl +
              sasToken
            }
            className={props.className}
          />
        ) : (
          <Avatar className={props.className} icon={<UserOutlined />} />
        )}
        {props.isShowName && (
          <Link to="" className="ml-1">
            {users.find((user) => user.id === props.userIds[0])?.name}
          </Link>
        )}
      </>
    );
  }
}
