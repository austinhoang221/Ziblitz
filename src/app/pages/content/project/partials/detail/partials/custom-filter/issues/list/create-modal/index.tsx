import { Alert, Form, Input, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import { useState } from "react";
import { getFilterIssue } from "../../../../../../../../../../../redux/slices/filterSlice";
import { FilterService } from "../../../../../../../../../../../services/filterService";
import { useAppDispatch } from "../../../../../../../../../../customHooks/dispatch";
import { checkResponseStatus } from "../../../../../../../../../../helpers";

interface ICustomFilterModal {
  payload: any;
  onCancel: () => void;
  onSave: () => void;
  isOpen: boolean;
}
export default function CustomFilterModal(props: ICustomFilterModal) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [form] = Form.useForm();
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;

  const onSave = () => {
    setIsLoading(true);
    const payload = {
      ...props.payload,
      creatorUserId: userId,
      name: name,
    };
    FilterService.create(payload).then((res) => {
      if (checkResponseStatus(res)) {
        props.onSave();
        dispatch(getFilterIssue());
        setIsLoading(false);
      }
    });
  };
  return (
    <Modal
      title="Save filter"
      onCancel={props.onCancel}
      onOk={onSave}
      confirmLoading={isLoading}
      open={props.isOpen}
    >
      <Alert
        className="mt-2"
        message="All of your current option will be added to this new filter"
        type="info"
      />
      <Form onClick={(e) => e.stopPropagation()} form={form}>
        <Form.Item
          label="Name"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          name="name"
          rules={[
            {
              required: true,
              message: "Please enter your filter name",
            },
          ]}
        >
          <Input
            type="text"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="Description"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          name="description"
        >
          <TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
}
