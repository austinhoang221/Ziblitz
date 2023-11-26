import { red } from "@ant-design/colors";
import { Button, Form, Input, message, Modal, Pagination } from "antd";
import TextArea from "antd/es/input/TextArea";
import Table, { ColumnsType } from "antd/es/table";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getProjectByCode } from "../../../../../../../../redux/slices/projectDetailSlice";
import { RootState } from "../../../../../../../../redux/store";
import { StatusService } from "../../../../../../../../services/statusService";
import { useAppDispatch } from "../../../../../../../customHooks/dispatch";
import useStatusData from "../../../../../../../customHooks/fetchStatus";
import { checkResponseStatus } from "../../../../../../../helpers";
import { IPagination } from "../../../../../../../models/IPagination";
import { IStatus } from "../../../../../../../models/IStatus";
import HeaderProject from "../header";

export default function Statuses() {
  const initialRequestParam: IPagination = {
    pageNum: 1,
    pageSize: 5,
    sort: ["name:asc"],
  };
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
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
  const [searchValue, setSearchValue] = useState<string>("");

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

  const onDeleteStatus = async (id: string) => {
    await StatusService.delete(project?.id!, id).then((res) => {
      if (checkResponseStatus(res)) {
        refreshData();
        dispatch(getProjectByCode(project?.code!));
        showSuccessMessage();
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
      dataIndex: "id",
      key: "action",
      width: "40px",
      render: (id: string) => {
        return (
          <Button type="text" shape="circle" onClick={() => onDeleteStatus(id)}>
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
    setIsModalOpen(true);
    setMode(mode);
    if (mode === "edit") {
      drawerForm.setFieldsValue(item);
      setStatusId(item?.id!);
    }
  };

  const onSearch = (value: string) => {
    setSearchValue(value);
  };

  return (
    <div className="issue-types">
      <HeaderProject
        title="Statuses"
        isFixedHeader={false}
        onSearch={onSearch}
        actionContent={
          <Button type="primary" onClick={() => onOpenModal("create")}>
            Create status
          </Button>
        }
      ></HeaderProject>
      <Table
        className="mt-3"
        columns={columns}
        dataSource={listStatus}
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
            label="Description"
            name="description"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <TextArea />
          </Form.Item>
        </Form>
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
