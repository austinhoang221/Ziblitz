import { blue } from "@ant-design/colors";
import {
  Badge,
  Button,
  Col,
  Dropdown,
  Empty,
  Menu,
  Row,
  Switch,
  Tooltip,
} from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomHookForObservable } from "../../../customHooks/observable";
import { IUserNotification } from "../../../models/IUserNotification";
import NotificationService from "../../signalr/notification.service";
import PresenceService from "../../signalr/presence.service";
import ButtonIcon from "../button-icon";
import IssueType from "../issue-type";
import UserAvatar from "../user-avatar";
import "./index.scss";
export default function UserNotification() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")!);

  const notificationService = NotificationService.getInstance(user.token);
  const presenceService = PresenceService.getInstance(user.token);

  const { storedQuotes, setObservable } = useCustomHookForObservable(
    notificationService.unreadNotifyNum
  );
  const [isUnRead, setisUnRead] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<IUserNotification[]>([]);

  const {
    storedQuotes: listNotification,
    setObservable: setNotificationObservable,
  } = useCustomHookForObservable(notificationService.notifications);

  useEffect(() => {
    setObservable(notificationService.unreadNotifyNum);
    setNotificationObservable(notificationService.notifications);
  }, [notificationService.unreadNotifyNum, notificationService.notifications]);

  useEffect(() => {
    if (isUnRead) {
      setNotifications(
        listNotification.filter(
          (notification: IUserNotification) => !notification.isRead
        )
      );
    } else {
      setNotifications(listNotification);
    }
  }, [listNotification, isUnRead]);

  const onChangeUnRead = (e: any) => {
    setisUnRead(e);
  };

  const onReadNotification = async (notification: IUserNotification) => {
    await notificationService.readNotify(notification.id);
    navigate(
      `/project/${notification.projectCode}/backlog/${notification.issueId}`
    );
  };

  return (
    <Dropdown
      trigger={["click"]}
      overlayStyle={{
        margin: "20px",
        inset: "35px auto auto 62px",
        width: "400px",
      }}
      arrow
      overlay={
        <>
          <Menu className="user-notification">
            <div className="p-2 align-child-space-between">
              <h3 className="mb-0 mt-0">Notification</h3>
              <div className="d-flex align-center">
                <span className="mr-2 text-muted">Only show unread</span>
                <Switch
                  checked={isUnRead}
                  title="Only show unread"
                  size="small"
                  onChange={onChangeUnRead}
                />
              </div>
            </div>
            <div style={{ maxHeight: "20rem", overflow: "hidden scroll" }}>
              {notifications?.length === 0 && <Empty></Empty>}
              {notifications?.map((notification: IUserNotification) => {
                return (
                  <Menu.Item
                    key={notification.id}
                    onClick={() => onReadNotification(notification)}
                  >
                    <Row gutter={16}>
                      <Col span={3}>
                        <UserAvatar
                          isMultiple={false}
                          userIds={[notification.creatorUserId]}
                          isShowName={false}
                        ></UserAvatar>
                      </Col>
                      <Col span={19}>
                        <div className="d-flex">
                          <span className="font-weight-medium noti-name text-truncate">
                            {notification.creatorUsername} {notification.name}
                          </span>
                          <span className="text-muted"></span>
                        </div>
                        <div className="d-flex align-center">
                          <Button
                            type="text"
                            className="p-0 mr-2"
                            style={{ width: "20px", height: "20px" }}
                          >
                            <IssueType
                              issueTypeKey={notification.issueType.icon}
                            ></IssueType>
                          </Button>
                          <Tooltip title={notification.issueName}>
                            <p
                              className="m-0 text-truncate"
                              style={{ width: "15rem" }}
                            >
                              {notification.issueName}
                            </p>
                          </Tooltip>
                        </div>

                        <div className="d-flex font-sz12">
                          {notification.issueCode} - {notification.statusName}
                        </div>
                      </Col>
                      <Col span={2}>
                        {!notification.isRead && (
                          <i
                            className="fa-solid fa-circle font-sz11"
                            style={{ color: blue.primary }}
                          ></i>
                        )}
                      </Col>
                    </Row>
                  </Menu.Item>
                );
              })}
            </div>
          </Menu>
        </>
      }
    >
      <Badge count={storedQuotes} overflowCount={99} className="mr-2 ml-2">
        <ButtonIcon iconClass="fa-solid fa-bell"></ButtonIcon>
      </Badge>
    </Dropdown>
  );
}
