import { orange, red } from "@ant-design/colors";
import {
  Alert,
  Button,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Select,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import Table, { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getProjectByCode } from "../../../../../../../../redux/slices/projectDetailSlice";
import { RootState } from "../../../../../../../../redux/store";
import { StatusService } from "../../../../../../../../services/statusService";
import { useAppDispatch } from "../../../../../../../customHooks/dispatch";
import useStatusData from "../../../../../../../customHooks/fetchStatus";
import { checkResponseStatus } from "../../../../../../../helpers";
import { IPagination } from "../../../../../../../models/IPagination";
import { IStatus } from "../../../../../../../models/IStatus";
import { IStatusCategory } from "../../../../../../../models/IStatusCategory";
import HeaderProject from "../header";

export default function Statuses() {
  const initialRequestParam: IPagination = {
    pageNum: 1,
    pageSize: 10,
    sort: ["name:asc"],
  };
  const { project, projectPermissions } = useSelector(
    (state: RootState) => state.projectDetail
  );
  const [drawerForm] = Form.useForm();

  const [requestParam, setRequestParam] =
    useState<IPagination>(initialRequestParam);
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<string>("");
  const [isLoadingButtonSave, setIsLoadingButtonSave] = useState(false);
  const [statusId, setStatusId] = useState<string>("");
  const [statusCategories, setStatusCategories] = useState<IStatusCategory[]>(
    []
  );
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [transferId, setTransferId] = useState<string>("");
  const [deleteStatus, setDeleteStatus] = useState<IStatus>();
  const editPermission =
    projectPermissions && projectPermissions.permissions.project.editPermission;
  const showSuccessMessage = () => {
    messageApi.open({
      type: "success",
      content: "Successfully",
    });
  };
  const { listStatus, totalCount, refreshData, isLoading } = useStatusData(
    project?.id!,
    requestParam
  );

  useEffect(() => {
    StatusService.getCategories().then((res) => {
      if (checkResponseStatus(res)) {
        setStatusCategories(res?.data!);
      }
    });
  }, []);

  const onDeleteStatus = async (id: string, transferId?: string) => {
    setIsLoadingButtonSave(true);
    await StatusService.delete(project?.id!, id, transferId).then((res) => {
      if (checkResponseStatus(res)) {
        refreshData();
        dispatch(getProjectByCode(project?.code!));
        showSuccessMessage();
        setIsLoadingButtonSave(false);
        setIsShowDeleteModal(false);
      }
    });
  };

  const columns: ColumnsType<IStatus> = [
    {
      title: "Name",
      key: "name",
      render: (status: IStatus) => {
        return <a onClick={() => onOpenModal("edit", status)}>{status.name}</a>;
      },
    },
    {
      title: "Category",
      dataIndex: "statusCategoryId",
      key: "statusCategoryId",
      width: "30%",
      render: (text: string) => {
        return (
          <span>{statusCategories.find((item) => item.id === text)?.name}</span>
        );
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
      render: (status: IStatus) => {
        return (
          <>
            {status.issueCount > 0 ? (
              <Button
                type="text"
                shape="circle"
                disabled={status.isMain || !editPermission}
                onClick={() => {
                  if (status.issueCount > 0) {
                    setIsShowDeleteModal(true);
                    setDeleteStatus(status);
                  } else {
                    onDeleteStatus(status.id);
                  }
                }}
              >
                <i
                  style={{ color: red.primary }}
                  className="fa-solid fa-trash-can"
                ></i>
              </Button>
            ) : (
              <Popconfirm
                title="Delete the status"
                description="Are you sure to delete this status?"
                okText="Yes"
                cancelText="Cancel"
                onConfirm={() => onDeleteStatus(status.id)}
                disabled={status.isMain || !editPermission}
              >
                <Button
                  type="text"
                  shape="circle"
                  disabled={status.isMain || !editPermission}
                >
                  <i
                    style={{ color: red.primary }}
                    className="fa-solid fa-trash-can"
                  ></i>
                </Button>
              </Popconfirm>
            )}
          </>
        );
      },
    },
  ];

  const onChangePagination = (page: number, size: number) => {
    setRequestParam({
      pageNum: page,
      pageSize: size,
      sort: requestParam.sort,
    });
  };

  const onSubmit = async () => {
    setIsLoadingButtonSave(true);
    const drawerFormValue = drawerForm.getFieldsValue();
    try {
      await drawerForm.validateFields();
      setIsLoadingButtonSave(true);

      const payload: IStatus = {
        ...drawerFormValue,
        projectId: project?.id,
      };
      let response;
      if (mode === "create") {
        response = await StatusService.create(project?.id!, payload);
      } else {
        response = await StatusService.update(project?.id!, statusId, payload);
      }
      if (checkResponseStatus(response)) {
        refreshData();
        dispatch(getProjectByCode(project?.code!));
        showSuccessMessage();
        setIsModalOpen(false);
      }
      setIsLoadingButtonSave(false);
    } catch (error) {
      setIsLoadingButtonSave(false);
    }
  };

  const onCancel = () => {
    setIsModalOpen(false);
    drawerForm.resetFields();
  };

  const onOpenModal = (mode: string, item?: IStatus) => {
    if (editPermission) {
      setIsModalOpen(true);
      setMode(mode);
      if (mode === "edit") {
        drawerForm.setFieldsValue(item);
        setStatusId(item?.id!);
      }
    }
  };

  const onSearch = (value: string) => {
    setSearchValue(value);
  };

  const onCancelDelete = () => {
    setIsShowDeleteModal(false);
    setTransferId("");
    setDeleteStatus(undefined);
  };

  return (
    <div className="issue-types">
      <HeaderProject
        title="Statuses"
        isFixedHeader={false}
        onSearch={onSearch}
        actionContent={
          editPermission && (
            <Button type="primary" onClick={() => onOpenModal("create")}>
              Create status
            </Button>
          )
        }
      ></HeaderProject>
      <Table
        className="mt-3"
        columns={columns}
        dataSource={listStatus}
        rowKey={(record) => record.id}
        pagination={false}
        loading={isLoading}
        scroll={{ y: 350 }}
      />
      {totalCount > 0 && (
        <Pagination
          className="mt-2 float-right"
          current={requestParam.pageNum}
          pageSize={requestParam.pageSize}
          total={totalCount}
          onChange={(page, size) => onChangePagination(page, size)}
        />
      )}
      {contextHolder}
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
            label="Category"
            required={true}
            name="statusCategoryId"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: "Please enter your status category",
              },
            ]}
          >
            <Select
              placeholder="Select category"
              options={statusCategories.map((category) => {
                return {
                  label: category.name,
                  value: category.id,
                };
              })}
            ></Select>
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
      </Modal>
      <Modal
        title="Delete status"
        closeIcon={null}
        onCancel={() => onCancelDelete()}
        onOk={onSubmit}
        footer={
          <>
            <Button type="default" onClick={() => onCancelDelete()}>
              Cancel
            </Button>
            <Button
              className="ml-2"
              type="primary"
              onClick={() => onDeleteStatus(deleteStatus?.id!, transferId)}
              htmlType="submit"
              danger
              loading={isLoadingButtonSave}
              disabled={!transferId}
            >
              Delete
            </Button>
          </>
        }
        open={isShowDeleteModal}
      >
        <Alert
          className="mt-2"
          message={
            <span>
              <i
                style={{ color: orange.primary }}
                className="fa-solid fa-triangle-exclamation"
              ></i>
              &nbsp; Your project has <b>{deleteStatus?.issueCount}</b>
              &nbsp;
              {deleteStatus?.name} issues. Before you can delete this status,
              change {deleteStatus?.name} issues to another status.
            </span>
          }
          type="warning"
        />
        <Form.Item
          label={`Change all existing ${deleteStatus?.name} issues to`}
          required={true}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          rules={[
            {
              required: true,
              message: "Please enter your new status id",
            },
          ]}
        >
          <Select
            placeholder="Select new status id"
            options={listStatus
              .filter((status) => status.id !== deleteStatus?.id)
              .map((category) => {
                return {
                  label: category.name,
                  value: category.id,
                };
              })}
            onChange={(e) => setTransferId(e)}
          ></Select>
        </Form.Item>
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
