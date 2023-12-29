import { orange, red } from "@ant-design/colors";
import {
  Alert,
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Popover,
  Row,
  Select,
  Table,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { ColumnsType } from "antd/es/table";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { getProjectByCode } from "../../../../../../../../redux/slices/projectDetailSlice";
import { RootState } from "../../../../../../../../redux/store";
import { IssueTypeService } from "../../../../../../../../services/issueTypeService";
import { useAppDispatch } from "../../../../../../../customHooks/dispatch";
import useIssueTypeData from "../../../../../../../customHooks/fetchIssueTypes";
import { checkResponseStatus } from "../../../../../../../helpers";
import { IIssueType } from "../../../../../../../models/IIssueType";
import { IPagination } from "../../../../../../../models/IPagination";
import IssueType from "../../../../../../components/issue-type";
import HeaderProject from "../header";
import "./index.scss";
export default function IssueTypes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<string>("");
  const [issueTypeKey, setIssueTypeKey] = useState<string>("10318");
  const [isChangeIcon, setIsChangeIcon] = useState(false);
  const [isLoadingButtonSave, setIsLoadingButtonSave] = useState(false);
  const [issueTypeId, setIssueTypeId] = useState<string>("");
  const [transferId, setTransferId] = useState<string>("");
  const [deleteType, setDeleteType] = useState<IIssueType>();
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);

  const initialRequestParam: IPagination = {
    pageNum: 1,
    pageSize: 10,
    sort: ["name:asc"],
  };
  const { project, projectPermissions } = useSelector(
    (state: RootState) => state.projectDetail
  );
  const editPermission =
    projectPermissions && projectPermissions.permissions.project.editPermission;
  const [drawerForm] = Form.useForm();
  const images = [
    "10300",
    "10304",
    "10306",
    "10308",
    "10309",
    "10310",
    "10311",
    "10312",
    "10313",
    "10314",
    "10318",
    "10320",
    "10321",
    "10322",
    "10323",
  ];
  const [requestParam, setRequestParam] =
    useState<IPagination>(initialRequestParam);
  const [searchValue, setSearchValue] = useState<string>("");

  const { listIssueType, totalCount, refreshData, isLoading } =
    useIssueTypeData(project?.id!, requestParam);
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const showSuccessMessage = () => {
    messageApi.open({
      type: "success",
      content: "Successfully",
    });
  };

  const onDeleteType = async (id: string, transferId?: string) => {
    setIsLoadingButtonSave(true);
    await IssueTypeService.delete(project?.id!, id, transferId).then((res) => {
      if (checkResponseStatus(res)) {
        refreshData();
        dispatch(getProjectByCode(project?.code!));
        showSuccessMessage();
        setIsLoadingButtonSave(false);
        setIsShowDeleteModal(false);
      }
    });
  };

  const columns: ColumnsType<IIssueType> = [
    {
      title: "Icon",
      key: "icon",
      width: "60px",
      render: (issueType: IIssueType) => {
        return <IssueType issueTypeKey={issueType.icon}></IssueType>;
      },
    },
    {
      title: "Name",
      key: "name",
      render: (issueType: IIssueType) => {
        return (
          <a onClick={() => onOpenModal("edit", issueType)}>{issueType.name}</a>
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
      width: "70px",
      render: (issueType: IIssueType) => {
        return (
          <>
            {issueType.issueCount > 0 ? (
              <Button
                type="text"
                shape="circle"
                disabled={issueType.isMain || !editPermission}
                onClick={() => {
                  if (issueType.issueCount > 0) {
                    setIsShowDeleteModal(true);
                    setDeleteType(issueType);
                  } else {
                    onDeleteType(issueType.id);
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
                title="Delete the issue type"
                description="Are you sure to delete this issue type?"
                okText="Yes"
                cancelText="Cancel"
                onConfirm={() => onDeleteType(issueType.id)}
                disabled={issueType.isMain || !editPermission}
              >
                <Button
                  type="text"
                  shape="circle"
                  disabled={issueType.isMain || !editPermission}
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

      const payload: IIssueType = {
        ...drawerFormValue,
        icon: issueTypeKey,
      };
      let response;
      if (mode === "create") {
        response = await IssueTypeService.create(project?.id!, payload);
      } else {
        response = await IssueTypeService.update(
          project?.id!,
          issueTypeId,
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

  const onChangeIcon = (img: string) => {
    setIssueTypeKey(img);
    setIsChangeIcon(false);
  };

  const onRenderChangeIcon = () => {
    return (
      <div style={{ width: "200px" }}>
        <Row>
          {images.map((img) => {
            return (
              <Col
                key={img}
                span={6}
                className="text-center cursor-pointer icon-picker"
                onClick={() => {
                  onChangeIcon(img);
                  setIsChangeIcon(false);
                }}
              >
                <img
                  width="30px"
                  height="30px"
                  alt={img}
                  src={require(`../../../../../../../assets/images/issue-types/${img}.png`)}
                ></img>
              </Col>
            );
          })}
        </Row>
      </div>
    );
  };

  const onCancel = () => {
    setIsModalOpen(false);
    setIsChangeIcon(false);
    drawerForm.resetFields();
  };

  const onOpenModal = (mode: string, item?: IIssueType) => {
    if (editPermission) {
      setIsModalOpen(true);
      setMode(mode);
      if (mode === "edit") {
        drawerForm.setFieldsValue(item);
        setIssueTypeKey(item?.icon ? item?.icon : item?.name!);
        setIssueTypeId(item?.id!);
      }
    }
  };

  const onSearch = (value: string) => {
    setSearchValue(value);
  };

  const onCancelDelete = () => {
    setIsShowDeleteModal(false);
    setTransferId("");
    setDeleteType(undefined);
  };

  return (
    <div className="issue-types">
      <HeaderProject
        title="Issue types"
        isFixedHeader={false}
        onSearch={onSearch}
        actionContent={
          editPermission && (
            <Button type="primary" onClick={() => onOpenModal("create")}>
              Create issue type
            </Button>
          )
        }
      ></HeaderProject>
      <Table
        className="mt-3"
        columns={columns}
        dataSource={listIssueType}
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
                message: "Please enter your issue type name",
              },
            ]}
          >
            <Input placeholder="Name" />
          </Form.Item>

          <Form.Item>
            <div className="d-flex align-center">
              <Button type="text">
                <IssueType issueTypeKey={issueTypeKey}></IssueType>
              </Button>
              <Popover
                open={isChangeIcon}
                content={onRenderChangeIcon}
                title="Choose an icon"
                trigger="click"
              >
                <Button
                  type="text"
                  className="ml-2"
                  onClick={() => setIsChangeIcon(true)}
                >
                  Change icon
                </Button>
              </Popover>
            </div>
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
        title="Delete issue type"
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
              onClick={() => onDeleteType(deleteType?.id!, transferId)}
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
              &nbsp; Your project has <b>{deleteType?.issueCount}</b>
              &nbsp;
              {deleteType?.name} issues. Before you can delete this issue type,
              change {deleteType?.name} issues to another issue type.
            </span>
          }
          type="warning"
        />
        <Form.Item
          label={`Change all existing ${deleteType?.name} issues to`}
          required={true}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          rules={[
            {
              required: true,
              message: "Please enter your new issue type id",
            },
          ]}
        >
          <Select
            placeholder="Select new issue type id"
            options={listIssueType
              .filter((type) => type.id !== deleteType?.id)
              .map((type) => {
                return {
                  label: type.name,
                  value: type.id,
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
