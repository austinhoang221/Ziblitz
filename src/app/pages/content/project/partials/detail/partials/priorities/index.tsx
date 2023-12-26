import { red } from "@ant-design/colors";
import {
  Alert,
  Button,
  ColorPicker,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Table,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { ColumnsType } from "antd/es/table";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getProjectByCode } from "../../../../../../../../redux/slices/projectDetailSlice";
import { RootState } from "../../../../../../../../redux/store";
import { PriorityService } from "../../../../../../../../services/priorityService";
import { useAppDispatch } from "../../../../../../../customHooks/dispatch";
import usePriorityData from "../../../../../../../customHooks/fetchPriority";
import { checkResponseStatus } from "../../../../../../../helpers";
import { IPriority } from "../../../../../../../models/IPriority";
import { IPagination } from "../../../../../../../models/IPagination";
import IssuePriority from "../../../../../../components/issue-priority";
import HeaderProject from "../header";
import type { ColorPickerProps } from "antd/es/color-picker";
export default function Priorities() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<string>("");
  const [isLoadingButtonSave, setIsLoadingButtonSave] = useState(false);
  const [priorityId, setPriorityId] = useState<string>("");
  const [colorValue, setColorValue] =
    useState<ColorPickerProps["value"]>("#1677ff");
  const [searchValue, setSearchValue] = useState<string>("");
  const [transferId, setTransferId] = useState<string>("");
  const [deletePriority, setDeletePriority] = useState<IPriority>();
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);

  const initialRequestParam: IPagination = {
    pageNum: 1,
    pageSize: 5,
    sort: ["name:asc"],
  };
  const { project, projectPermissions } = useSelector(
    (state: RootState) => state.projectDetail
  );
  const editPermission =
    projectPermissions && projectPermissions.permissions.project.editPermission;
  const [drawerForm] = Form.useForm();

  const [requestParam, setRequestParam] =
    useState<IPagination>(initialRequestParam);

  const { listPriority, totalCount, refreshData, isLoading } = usePriorityData(
    project?.id!,
    requestParam
  );
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const showSuccessMessage = () => {
    messageApi.open({
      type: "success",
      content: "Successfully",
    });
  };

  const onDeletePriority = async (id: string, transferId?: string) => {
    setIsLoadingButtonSave(true);
    await PriorityService.delete(project?.id!, id, transferId).then((res) => {
      if (checkResponseStatus(res)) {
        refreshData();
        dispatch(getProjectByCode(project?.code!));
        showSuccessMessage();
        setIsLoadingButtonSave(false);
      }
    });
  };

  const columns: ColumnsType<IPriority> = [
    {
      title: "Icon",
      key: "icon",
      width: "40px",
      render: (priority: IPriority) => {
        return <IssuePriority priorityId={priority.id}></IssuePriority>;
      },
    },
    {
      title: "Name",
      key: "name",
      render: (priority: IPriority) => {
        return (
          <a onClick={() => onOpenModal("edit", priority)}>{priority.name}</a>
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
      width: "40px",
      render: (priority: IPriority) => {
        return (
          <Button
            type="text"
            shape="circle"
            disabled={priority.isMain || !editPermission}
            loading={isLoadingButtonSave}
            onClick={() => {
              if (priority.issueCount > 0) {
                setIsShowDeleteModal(true);
                setDeletePriority(priority);
              } else {
                onDeletePriority(priority.id);
              }
            }}
          >
            <i
              style={{ color: red.primary }}
              className="fa-solid fa-trash-can"
            ></i>
          </Button>
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

      const payload: IPriority = {
        ...drawerFormValue,
        color: colorValue,
        projectId: project?.id,
      };
      let response;
      if (mode === "create") {
        response = await PriorityService.create(project?.id!, payload);
      } else {
        response = await PriorityService.update(
          project?.id!,
          priorityId,
          payload
        );
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

  const onOpenModal = (mode: string, item?: IPriority) => {
    if (editPermission) {
      setIsModalOpen(true);
      setMode(mode);
      if (mode === "edit") {
        drawerForm.setFieldsValue(item);
        setColorValue(item?.color);
        setPriorityId(item?.id!);
      }
    }
  };

  const onSearch = (value: string) => {
    setSearchValue(value);
  };

  const onCancelDelete = () => {
    setIsShowDeleteModal(false);
    setTransferId("");
    setDeletePriority(undefined);
  };

  return (
    <div className="issue-types">
      <HeaderProject
        title="Priorities"
        isFixedHeader={false}
        onSearch={onSearch}
        actionContent={
          editPermission && (
            <Button type="primary" onClick={() => onOpenModal("create")}>
              Create priority
            </Button>
          )
        }
      ></HeaderProject>
      <Table
        className="mt-3"
        columns={columns}
        dataSource={listPriority}
        rowKey={(record) => record.id}
        pagination={false}
        loading={isLoading}
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
                message: "Please enter your priority name",
              },
            ]}
          >
            <Input placeholder="Name" />
          </Form.Item>

          <Form.Item
            label="Icon class"
            required={true}
            name="icon"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            rules={[
              {
                required: true,
                message: "Please enter your icon class (font-awesome)",
              },
            ]}
          >
            <Input placeholder="Icon class" />
          </Form.Item>

          <Form.Item
            label="Color"
            required={true}
            rules={[
              {
                required: true,
                message: "Please enter your color",
              },
            ]}
          >
            <ColorPicker
              value={colorValue}
              onChangeComplete={(value) => setColorValue(value.toHexString())}
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
              onClick={() => onDeletePriority(deletePriority?.id!, transferId)}
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
          message={`Before you can delete this priority, change ${deletePriority?.name} issues to another priority.`}
          type="warning"
        />
        <Form.Item
          label={`Change all existing ${deletePriority?.name} issues to`}
          required={true}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          rules={[
            {
              required: true,
              message: "Please enter your new priority id",
            },
          ]}
        >
          <Select
            placeholder="Select new priority id"
            options={listPriority
              .filter((priortity) => priortity.id !== deletePriority?.id)
              .map((priortity) => {
                return {
                  label: priortity.name,
                  value: priortity.id,
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
