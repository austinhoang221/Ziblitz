import {
  Button,
  Dropdown,
  Form,
  Input,
  MenuProps,
  Modal,
  Pagination,
} from "antd";
import Search from "antd/es/input/Search";
import Table, { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import useProjectData from "../../../customHooks/fetchProject";
import { IPagination } from "../../../models/IPagination";
import { IProject } from "../../../models/IProject";
import UserAvatar from "../../components/user-avatar";
import ButtonIcon from "../../components/button-icon";
import "./index.scss";
import { useState } from "react";
import { ProjectService } from "../../../../services/projectService";
import { checkResponseStatus } from "../../../helpers";
import { useDispatch } from "react-redux";
import { createProject } from "../../../../redux/slices/projectSlice";
import TextArea from "antd/es/input/TextArea";
export default function Project() {
  const initialRequestParam: IPagination = {
    pageNum: 1,
    pageSize: 20,
  };

  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  const [requestParam, setRequestParam] =
    useState<IPagination>(initialRequestParam);
  const { listOfData } = useProjectData(userId, requestParam);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingButtonSave, setIsLoadingButtonSave] = useState(false);
  const [modalForm] = Form.useForm();
  const dispatch = useDispatch();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Project settings",
    },
    {
      key: "2",
      label: "Move to trash",
    },
  ];

  const columns: ColumnsType<IProject> = [
    {
      title: <i className="fa-solid fa-star"></i>,
      dataIndex: "star",
      key: "star",
      width: "40px",
      align: "center",
      render: () => <ButtonIcon iconClass="fa-regular fa-star"></ButtonIcon>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => {
        return (
          <>
            {/* <img src={record.avatarUrl} alt="" />{" "} */}
            <Link to="">{text}</Link>
          </>
        );
      },
    },
    {
      title: "Key",
      dataIndex: "code",
      key: "code",
      render: (text: string) => {
        return (
          <>
            {/* <img src={record.avatarUrl} alt="" />{" "} */}
            <span>{text}</span>
          </>
        );
      },
    },
    {
      title: "Lead",
      dataIndex: "leaderId",
      key: "leaderId",
      render: (text: string) => {
        return (
          <>
            {/* <img src={record.avatarUrl} alt="" />{" "} */}
            <UserAvatar
              userIds={[text]}
              isMultiple={false}
              isShowName={true}
            ></UserAvatar>
          </>
        );
      },
    },
    {
      title: "",
      width: "40px",
      render: () => {
        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Button type="text" onClick={(e) => e.preventDefault()}>
              <i className="fa-solid fa-ellipsis"></i>
            </Button>
          </Dropdown>
        );
      },
    },
  ];
  const showModal = () => {
    setIsModalOpen(true);
  };

  const onClickCancel = () => {
    modalForm.resetFields();
    setIsModalOpen(false);
  };

  const onSubmit = async () => {
    setIsLoadingButtonSave(true);
    const modalFormValue = modalForm.getFieldsValue();
    try {
      await modalForm.validateFields();
      setIsLoadingButtonSave(true);

      const payload: IProject = {
        ...modalFormValue,
        avatarUrl: "",
        isFavorite: false,
      };
      const response = await ProjectService.createProject(userId, payload);
      if (checkResponseStatus(response)) {
        dispatch(createProject(response!.data));
        setIsModalOpen(false);
      }
      setIsLoadingButtonSave(false);
    } catch (error) {
      console.error("Form validation error:", error);
      setIsLoadingButtonSave(false);
    }
  };

  const onChangePagination = (page: number, size: number) => {
    setRequestParam({
      pageNum: page,
      pageSize: size,
    });
  };

  const renderFooter = () => {
    return (
      <>
        <div className="">
          <Button type="default" onClick={onClickCancel}>
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={onSubmit}
            htmlType="submit"
            loading={isLoadingButtonSave}
          >
            Create project
          </Button>
        </div>
      </>
    );
  };
  return (
    <>
      <div className="align-child-space-between align-center">
        <h2>Project</h2>
        <Button type="primary" onClick={showModal}>
          Create project
        </Button>
      </div>
      <div className="d-flex align-center">
        <Search
          className="mr-2"
          placeholder="Search..."
          style={{ width: 200 }}
        />
      </div>
      <Table
        className="mt-3"
        columns={columns}
        dataSource={listOfData}
        rowKey={(record) => record.id}
        pagination={false}
      />
      <Pagination
        className="mt-2 float-right"
        current={requestParam.pageNum}
        pageSize={requestParam.pageSize}
        onChange={(page, size) => onChangePagination(page, size)}
      />
      <Modal
        title="Add project"
        open={isModalOpen}
        footer={renderFooter}
        onCancel={onClickCancel}
      >
        <Form form={modalForm} className="login-form" onFinish={onSubmit}>
          <Form.Item
            label="Name"
            required={true}
            name="name"
            rules={[
              { required: true, message: "Please enter your project name" },
            ]}
          >
            <Input placeholder="Try a team name. project goal, milestone,..." />
          </Form.Item>
          <Form.Item
            label="Key"
            tooltip="Choose a descriptive prefix for your project’s issue keys to recognize work from this project."
            required={true}
            name="code"
            rules={[
              { required: true, message: "Please enter your project key" },
            ]}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
