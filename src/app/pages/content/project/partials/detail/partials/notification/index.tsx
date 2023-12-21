import { red } from "@ant-design/colors";
import {
  Alert,
  Button,
  Checkbox,
  Form,
  message,
  Modal,
  Popconfirm,
  Select,
  Table,
} from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../../../redux/store";
import { NotificationService } from "../../../../../../../../services/notificationService";
import { checkResponseStatus } from "../../../../../../../helpers";
import { IIssueEvent } from "../../../../../../../models/IIssueEvent";
import { INotificationEvent } from "../../../../../../../models/INotificationEvent";
import HeaderProject from "../header";

export default function NotificationProject() {
  const [searchValue, setSearchValue] = useState<string>("");
  const [eventId, setEventId] = useState<string>("");
  const { project, projectPermissions } = useSelector(
    (state: RootState) => state.projectDetail
  );
  const [mode, setMode] = useState<string>("");
  const [issueEvent, setIssueEvents] = useState<IIssueEvent[]>([]);
  const [listNotificationEvent, setlistNotificationEvent] = useState<
    INotificationEvent[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allWatcher, setAllWatcher] = useState(false);
  const [currentAssignee, setCurrentAssignee] = useState(false);
  const [reporter, setReporter] = useState(false);
  const [projectLead, setProjectLead] = useState(false);
  const [drawerForm] = Form.useForm();
  const [isLoadingButtonSave, setIsLoadingButtonSave] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationId, setNotificationId] = useState<string>("");
  const [notificationEventId, setNotificationEventId] = useState<string>("");
  const showSuccessMessage = () => {
    messageApi.open({
      type: "success",
      content: "Successfully",
    });
  };
  const [messageApi, contextHolder] = message.useMessage();

  const editPermission =
    projectPermissions && projectPermissions.permissions.project.editPermission;

  const columns: ColumnsType<INotificationEvent> = [
    {
      title: "Name",
      key: "name",
      render: (notification: INotificationEvent) => {
        return (
          <a onClick={() => onOpenModal("edit", notification)}>
            {notification.eventName}
          </a>
        );
      },
    },
    {
      title: "Recipient",
      key: "recipient",
      width: "30%",
      render: (notification: INotificationEvent) => {
        return <span>{onRenderRecipient(notification)}</span>;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "30%",
      render: (text: string) => {
        return <span>{text}</span>;
      },
    },
    {
      title: "",
      key: "action",
      width: "60px",
      render: (notification: INotificationEvent) => {
        return (
          <Popconfirm
            title="Delete the notification"
            description="Are you sure to delete this notification?"
            okText="Yes"
            cancelText="Cancel"
            onConfirm={() => onDeleteNotification(notification.id)}
            disabled={!editPermission ?? false}
          >
            <Button
              type="text"
              shape="circle"
              disabled={!editPermission ?? false}
            >
              <i
                style={{ color: red.primary }}
                className="fa-solid fa-trash-can"
              ></i>
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  const onRenderRecipient = (notification: INotificationEvent) => {
    const input = {
      allWatcher: notification.allWatcher,
      currentAssignee: notification.currentAssignee,
      reporter: notification.reporter,
      projectLead: notification.projectLead,
    };
    return convertKeysToString(input);
  };

  const convertKeysToString = (obj: Record<string, boolean>): string => {
    const keyMappings: Record<string, string> = {
      allWatcher: "All Watcher",
      currentAssignee: "Current Assignee",
      reporter: "Reporter",
      projectLead: "Project Lead",
      // Add more mappings as needed
    };

    const result: string[] = [];

    for (const [key, value] of Object.entries(obj)) {
      if (value) {
        result.push(keyMappings[key]);
      }
    }

    return result.join(", ");
  };

  const onSearch = (value: string) => {
    setSearchValue(value);
  };

  useEffect(() => {
    NotificationService.getEvents().then((res) => {
      if (checkResponseStatus(res)) {
        setIssueEvents(res?.data!);
      }
    });
  }, []);

  useEffect(() => {
    if (project?.id) {
      fetchNotification();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id]);

  const fetchNotification = () => {
    setIsLoadingButtonSave(true);
    NotificationService.getNotifications(project?.id!).then((res) => {
      if (checkResponseStatus(res)) {
        setNotificationId(res?.data?.id!);
        setlistNotificationEvent(res?.data.notificationEvent!);
      }

      setIsLoadingButtonSave(false);
    });
  };

  const onDeleteNotification = async (id: string) => {
    setIsLoadingButtonSave(true);
    await NotificationService.deleteNotificationEvent(notificationId, id).then(
      (res) => {
        if (checkResponseStatus(res)) {
          fetchNotification();
          showSuccessMessage();
        }
        setIsLoadingButtonSave(false);
      }
    );
  };

  const onOpenModal = (mode: string, item?: INotificationEvent) => {
    setIsModalOpen(true);
    setMode(mode);
    if (mode === "edit") {
      setEventId(item?.eventId!);
      setNotificationEventId(item?.id!);
      setAllWatcher(item?.allWatcher!);
      setCurrentAssignee(item?.currentAssignee!);
      setProjectLead(item?.projectLead!);
      setReporter(item?.reporter!);
      drawerForm.setFieldsValue(item);
    }
  };

  const onCancel = () => {
    setIsModalOpen(false);
    drawerForm.resetFields();
    setEventId("");
    setAllWatcher(false);
    setCurrentAssignee(false);
    setProjectLead(false);
    setReporter(false);
  };

  const onSubmit = () => {
    drawerForm.validateFields();
    if (eventId) {
      if (mode === "create") {
        const payload = {
          eventId: eventId,
          allWatcher: allWatcher,
          currentAssignee: currentAssignee,
          reporter: reporter,
          projectLead: projectLead,
        };
        NotificationService.createNotificationEvent(
          notificationId,
          payload
        ).then((res) => {
          if (checkResponseStatus(res)) {
            showSuccessMessage();
            fetchNotification();
            onCancel();
          }
        });
      } else {
        const payload = {
          allWatcher: allWatcher,
          currentAssignee: currentAssignee,
          reporter: reporter,
          projectLead: projectLead,
        };
        NotificationService.updateNotificationEvent(
          notificationId,
          notificationEventId,
          payload
        ).then((res) => {
          if (checkResponseStatus(res)) {
            showSuccessMessage();
            fetchNotification();
            onCancel();
          }
        });
      }
    }
  };

  return (
    <>
      {contextHolder}
      <HeaderProject
        title="Notification"
        isFixedHeader={false}
        onSearch={onSearch}
        actionContent={
          editPermission && (
            <Button type="primary" onClick={() => onOpenModal("create")}>
              Create notification
            </Button>
          )
        }
      ></HeaderProject>
      <Alert
        className="mt-2"
        message="Ziblitz can send people or roles an email when events happen on an issue - for example, when someone comments on an issue."
        type="info"
      />
      <Table
        className="mt-3"
        columns={columns}
        dataSource={listNotificationEvent}
        rowKey={(record) => record.id}
        pagination={false}
        loading={isLoading}
        scroll={{ y: 340 }}
      />
      <Modal
        title={mode === "edit" ? "Update" : "Create"}
        closeIcon={null}
        onCancel={onCancel}
        onOk={onSubmit}
        open={isModalOpen}
        footer={
          <Footer
            onClickCancel={onCancel}
            onSubmit={onSubmit}
            mode={mode}
            isLoadingButtonSave={isLoadingButtonSave}
          />
        }
      >
        <Form form={drawerForm} className="form" onFinish={onSubmit}>
          <Form.Item
            label="When this happens: "
            required={true}
            name="eventId"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: "Please enter your event",
              },
            ]}
          >
            {mode === "create" ? (
              <Select
                placeholder="Select event"
                options={issueEvent
                  .filter((event) => {
                    const list = listNotificationEvent.map(
                      (notification) => notification.eventId
                    );
                    return !list?.includes(event.id);
                  })
                  .map((event) => {
                    return {
                      label: event.name,
                      value: event.id,
                    };
                  })}
                onChange={setEventId}
              ></Select>
            ) : (
              <span className="text-muted">
                {issueEvent?.find((event) => event.id === eventId)?.name}
              </span>
            )}
          </Form.Item>
          <Form.Item
            label="Send a notification to"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Checkbox
              checked={allWatcher}
              onChange={(e) => setAllWatcher(e.target.checked)}
              className="w-100"
            >
              All Watchers
            </Checkbox>
            <Checkbox
              checked={currentAssignee}
              onChange={(e) => setCurrentAssignee(e.target.checked)}
              className="w-100"
            >
              Current Assignee
            </Checkbox>
            <Checkbox
              checked={reporter}
              onChange={(e) => setReporter(e.target.checked)}
              className="w-100"
            >
              Reporter
            </Checkbox>
            <Checkbox
              checked={projectLead}
              onChange={(e) => setProjectLead(e.target.checked)}
              className="w-100"
            >
              Project Lead
            </Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

function Footer(props: any) {
  return (
    <div>
      <Button type="default" onClick={props.onClickCancel}>
        Cancel
      </Button>
      {props.mode === "edit" ? (
        <Button
          className="ml-2"
          type="primary"
          onClick={props.onSubmit}
          htmlType="submit"
          loading={props.isLoadingButtonSave}
        >
          Update
        </Button>
      ) : (
        <Button
          className="ml-2"
          type="primary"
          onClick={props.onSubmit}
          htmlType="submit"
          loading={props.isLoadingButtonSave}
        >
          Create
        </Button>
      )}
    </div>
  );
}
