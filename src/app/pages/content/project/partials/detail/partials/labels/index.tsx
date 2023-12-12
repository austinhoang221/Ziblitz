import { red } from "@ant-design/colors";
import {
  Button,
  ColorPicker,
  ColorPickerProps,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Popconfirm,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import Table, { ColumnsType } from "antd/es/table";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getProjectByCode } from "../../../../../../../../redux/slices/projectDetailSlice";
import { RootState } from "../../../../../../../../redux/store";
import { LabelService } from "../../../../../../../../services/labelService";
import { useAppDispatch } from "../../../../../../../customHooks/dispatch";
import { checkResponseStatus } from "../../../../../../../helpers";
import { IPagination } from "../../../../../../../models/IPagination";
import { ILabel } from "../../../../../../../models/ILabel";
import HeaderProject from "../header";
import useLabelData from "../../../../../../../customHooks/fetchLabel";

export default function Labels() {
  const initialRequestParam: IPagination = {
    pageNum: 1,
    pageSize: 5,
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
  const [labelId, setLabelId] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [colorValue, setColorValue] =
    useState<ColorPickerProps["value"]>("#1677ff");
  const editPermission =
    projectPermissions && projectPermissions.permissions.project.editPermission;
  const showSuccessMessage = () => {
    messageApi.open({
      type: "success",
      content: "Successfully",
    });
  };
  const { listLabel, totalCount, refreshData, isLoading } = useLabelData(
    project?.id!,
    requestParam
  );

  const onDeleteLabel = async (id: string) => {
    await LabelService.delete(project?.id!, id).then((res) => {
      if (checkResponseStatus(res)) {
        refreshData();
        dispatch(getProjectByCode(project?.code!));
        showSuccessMessage();
      }
    });
  };

  const columns: ColumnsType<ILabel> = [
    {
      title: "Name",
      key: "name",
      render: (label: ILabel) => {
        return <a onClick={() => onOpenModal("edit", label)}>{label.name}</a>;
      },
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      width: "30%",
      render: (text: string) => {
        return <ColorPicker value={text} disabled={true} />;
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
      render: (label: ILabel) => {
        return (
          <Popconfirm
            title="Delete the label"
            description="Are you sure to delete this label?"
            okText="Yes"
            cancelText="Cancel"
            onConfirm={() => onDeleteLabel(label.id)}
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

      const payload: ILabel = {
        ...drawerFormValue,
        color: colorValue,
        projectId: project?.id,
      };
      let response;
      if (mode === "create") {
        response = await LabelService.create(project?.id!, payload);
      } else {
        response = await LabelService.update(project?.id!, labelId, payload);
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

  const onOpenModal = (mode: string, item?: ILabel) => {
    if (editPermission) {
      setIsModalOpen(true);
      setMode(mode);
      if (mode === "edit") {
        drawerForm.setFieldsValue(item);
        setColorValue(item?.color);
        setLabelId(item?.id!);
      }
    }
  };

  const onSearch = (value: string) => {
    setSearchValue(value);
  };

  return (
    <div className="issue-types">
      <HeaderProject
        title="Labels"
        isFixedHeader={false}
        onSearch={onSearch}
        actionContent={
          editPermission && (
            <Button type="primary" onClick={() => onOpenModal("create")}>
              Create label
            </Button>
          )
        }
      ></HeaderProject>
      <Table
        className="mt-3"
        columns={columns}
        dataSource={listLabel}
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
                message: "Please enter your label name",
              },
            ]}
          >
            <Input placeholder="Name" />
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
