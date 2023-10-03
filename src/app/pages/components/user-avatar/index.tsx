import { Avatar, Divider, Tooltip } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../../../redux/store";
import { IUser } from "../../../models/IUser";

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
                <Avatar src={user.avatarUrl} />
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
        <Avatar
          className={props.className}
          src={users.find((user) => user.id === props.userIds[0])?.avatarUrl}
        />
        {props.isShowName && (
          <Link to="" className="ml-2">
            {users.find((user) => user.id === props.userIds[0])?.name}
          </Link>
        )}
      </>
    );
  }
}
