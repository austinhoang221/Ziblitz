import { red } from "@ant-design/colors";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Table,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../../../redux/store";
import { VersionService } from "../../../../../../../../services/versionService";
import useVersionData from "../../../../../../../customHooks/fetchVersion";
import { checkResponseStatus } from "../../../../../../../helpers";
import { IVersion } from "../../../../../../../models/IVersion";
import ChildIssues from "../../../../../../components/child-issues";
import IssueProgress from "../../../../../../components/issues-progress";
import HeaderProject from "../header";

export default function Release() {
  const [searchValue, setSearchValue] = useState<string>("");
  const { project, projectPermissions } = useSelector(
    (state: RootState) => state.projectDetail
  );
  const { listVersion, isLoading, refreshData } = useVersionData(project?.id!);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<string>("");
  const [isLoadingButtonSave, setIsLoadingButtonSave] = useState(false);
  const [versionId, setVersionId] = useState<string>("");
  const [version, setVersion] = useState<IVersion>();
  const [drawerForm] = Form.useForm();
  const { RangePicker } = DatePicker;
  const [date, setDate] = useState<any[]>([]);

  const editPermission =
    projectPermissions && projectPermissions.permissions.project.editPermission;
  const [messageApi, contextHolder] = message.useMessage();
  const showSuccessMessage = () => {
    messageApi.open({
      type: "success",
      content: "Successfully",
    });
  };
  const columns: ColumnsType<IVersion> = [
    {
      title: "Name",
      key: "name",
      render: (version: IVersion) => {
        return (
          <a onClick={() => onOpenModal("edit", version)}>{version.name}</a>
        );
      },
    },
    {
      title: "Progress",
      key: "name",
      render: (version: IVersion) => {
        return <IssueProgress issues={version?.issues ?? []}></IssueProgress>;
      },
    },
    {
      title: "Status",
      key: "status",
      width: "15%",
      render: (version: IVersion) => {
        return <span>{version.statusId}</span>;
      },
    },
    {
      title: "Start date",
      key: "start",
      width: "12%",
      render: (version: IVersion) => {
        return (
          <span>
            {version.startDate
              ? dayjs(version.startDate).format("MMM D, YYYY")
              : ""}
          </span>
        );
      },
    },
    {
      title: "Release date",
      key: "release",
      width: "12%",
      render: (version: IVersion) => {
        return (
          <span>
            {version.releaseDate
              ? dayjs(version.releaseDate).format("MMM D, YYYY")
              : ""}
          </span>
        );
      },
    },
    {
      title: "Description",
      key: "description",
      dataIndex: "description",
      width: "20%",
      render: (text: string) => {
        return <span>{text}</span>;
      },
    },
    {
      title: "",
      key: "action",
      width: "40px",
      render: (version: IVersion) => {
        return (
          <Popconfirm
            title="Delete the version"
            description="Are you sure to delete this version?"
            okText="Yes"
            cancelText="Cancel"
            onConfirm={() => onDeleteVersion(version.id)}
            disabled={!editPermission}
          >
            <Button type="text" shape="circle" disabled={!editPermission}>
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
  const onSearch = (value: string) => {
    setSearchValue(value);
  };

  const onDeleteVersion = async (id: string) => {
    await VersionService.delete(project?.id!, id).then((res) => {
      if (checkResponseStatus(res)) {
        refreshData();
        showSuccessMessage();
      }
    });
  };

  const onOpenModal = (mode: string, item?: IVersion) => {
    if (editPermission) {
      setIsModalOpen(true);
      setMode(mode);
      if (mode === "edit") {
        drawerForm.setFieldsValue(item);
        const time = [dayjs(item?.startDate), dayjs(item?.releaseDate)];
        drawerForm.setFieldValue("time", time);
        setVersionId(item?.id!);
        setVersion(item);
      }
    }
  };

  const onRenderMember = () => {
    const members = [...(project?.members ?? [])];
    members.unshift(project?.leader!);
    return members;
  };

  const onCancel = () => {
    setIsModalOpen(false);
    setDate([]);
    drawerForm.resetFields();
  };

  const onSubmit = async () => {
    setIsLoadingButtonSave(true);
    const drawerFormValue = drawerForm.getFieldsValue();
    try {
      await drawerForm.validateFields();
      setIsLoadingButtonSave(true);

      const payload: any = {
        ...drawerFormValue,
        startDate: date?.[0] ? dayjs(date?.[0]).toISOString() : null,
        releaseDate: date?.[1] ? dayjs(date?.[1]).toISOString() : null,
        projectId: project?.id,
      };
      let response;
      if (mode === "create") {
        response = await VersionService.create(project?.id!, payload);
      } else {
        response = await VersionService.update(
          project?.id!,
          versionId,
          payload
        );
      }
      if (checkResponseStatus(response)) {
        refreshData();
        showSuccessMessage();
        setIsModalOpen(false);
      }
      setIsLoadingButtonSave(false);
    } catch (error) {
      setIsLoadingButtonSave(false);
    }
  };

  return (
    <div className="issue-types">
      {contextHolder}
      <HeaderProject
        title="Releases"
        isFixedHeader={false}
        onSearch={onSearch}
        actionContent={
          editPermission && (
            <Button type="primary" onClick={() => onOpenModal("create")}>
              Create release
            </Button>
          )
        }
      ></HeaderProject>
      <Table
        className="mt-3"
        columns={columns}
        dataSource={listVersion}
        rowKey={(record) => record.id}
        pagination={false}
        loading={isLoading}
      />
      <Modal
        title={mode === "edit" ? "Update" : "Create"}
        closeIcon={null}
        onCancel={onCancel}
        onOk={onSubmit}
        open={isModalOpen}
        width={mode === "create" ? "20rem" : "40rem"}
        footer={
          <Footer
            onClickCancel={onCancel}
            onSubmit={onSubmit}
            mode={mode}
            isLoadingButtonSave={isLoadingButtonSave}
          />
        }
      >
        <Row gutter={24}>
          <Col span={mode === "create" ? 24 : 14}>
            <Form form={drawerForm} className="form" onFinish={onSubmit}>
              <Form.Item
                label="Name"
                required={true}
                name="name"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Please enter your status name",
                  },
                ]}
              >
                <Input placeholder="Name" />
              </Form.Item>
              <Form.Item
                label="Driver"
                required={true}
                name="driverId"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Please enter your driver",
                  },
                ]}
              >
                <Select
                  placeholder="Select driver"
                  options={onRenderMember()?.map((member) => {
                    return {
                      label: member?.name,
                      value: member?.id,
                    };
                  })}
                ></Select>
              </Form.Item>

              <Form.Item
                label="Time"
                name="time"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <RangePicker
                  format="DD/MM/YYYY"
                  picker="week"
                  className="w-100"
                  onChange={(e) => setDate(e!)}
                  allowClear={false}
                />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <TextArea />
              </Form.Item>
            </Form>
          </Col>
          <Col span={10}>
            {mode === "edit" && (
              <ChildIssues data={version?.issues ?? []}></ChildIssues>
            )}
          </Col>
        </Row>
      </Modal>
    </div>
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
