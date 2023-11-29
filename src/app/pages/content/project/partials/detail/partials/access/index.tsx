import { Button, Form, Input, message, Modal, Pagination, Table } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../../../redux/store";
import { useAppDispatch } from "../../../../../../../customHooks/dispatch";
import { IPagination } from "../../../../../../../models/IPagination";
import { IPermissionGroup } from "../../../../../../../models/IPermission";
import HeaderProject from "../header";

export default function AccessProject() {
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

  const onCancel = () => {
    setIsModalOpen(false);
    drawerForm.resetFields();
  };

  const onOpenModal = (mode: string, item?: IPermissionGroup) => {
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
    <></>
    // <div className="issue-types">
    //   <HeaderProject
    //     title="Statuses"
    //     isFixedHeader={false}
    //     onSearch={onSearch}
    //     actionContent={
    //       <Button type="primary" onClick={() => onOpenModal("create")}>
    //         Create status
    //       </Button>
    //     }
    //   ></HeaderProject>
    //   <Table
    //     className="mt-3"
    //     columns={columns}
    //     dataSource={listStatus}
    //     rowKey={(record) => record.id}
    //     pagination={false}
    //     loading={isLoading}
    //   />
    //   {totalCount > 0 && (
    //     <Pagination
    //       className="mt-2 float-right"
    //       current={requestParam.pageNum}
    //       pageSize={requestParam.pageSize}
    //       total={totalCount}
    //       onChange={(page, size) => onChangePagination(page, size)}
    //     />
    //   )}
    //   {contextHolder}
    //   <Modal
    //     title={mode === "edit" ? "Update" : "Create"}
    //     closeIcon={null}
    //     onCancel={onCancel}
    //     onOk={onSubmit}
    //     open={isModalOpen}
    //     footer={
    //       <Footer
    //         onClickCancel={onCancel}
    //         onSubmit={onSubmit}
    //         mode={mode}
    //         isLoadingButtonSave={isLoadingButtonSave}
    //       />
    //     }
    //   >
    //     <Form form={drawerForm} className="form" onFinish={onSubmit}>
    //       <Form.Item
    //         label="Name"
    //         required={true}
    //         name="name"
    //         labelCol={{ span: 24 }}
    //         wrapperCol={{ span: 24 }}
    //         rules={[
    //           {
    //             required: true,
    //             message: "Please enter your priority name",
    //           },
    //         ]}
    //       >
    //         <Input placeholder="Name" />
    //       </Form.Item>

    //       <Form.Item
    //         label="Description"
    //         name="description"
    //         labelCol={{ span: 24 }}
    //         wrapperCol={{ span: 24 }}
    //       >
    //         <TextArea />
    //       </Form.Item>
    //     </Form>
    //   </Modal>
    // </div>
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
