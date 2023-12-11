import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { UserService } from "../../../../../services/userService";
import { checkResponseStatus } from "../../../../helpers";
import "./index.scss";
export default function UserInfo(props: any) {
  const { user } = props;
  const [infoForm] = Form.useForm();
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);
  const [isLoadingButtonSave, setIsLoadingButtonSave] =
    useState<boolean>(false);

  const handleFormChange = () => {
    if (!isFormDirty) {
      setIsFormDirty(true); // Mark the form as dirty when changes occur
    }
  };

  const onSubmit = () => {
    const payload = {
      id: user?.id!,
      name: infoForm.getFieldValue("name"),
      department: infoForm.getFieldValue("department"),
      organization: infoForm.getFieldValue("organization"),
      jobTitle: infoForm.getFieldValue("jobTitle"),
      location: infoForm.getFieldValue("location"),
      email: infoForm.getFieldValue("email"),
    };
    setIsLoadingButtonSave(true);
    UserService.update(user?.id, payload).then((res) => {
      if (checkResponseStatus(res)) {
        setIsFormDirty(false);
        props.onSaveSuccess();
      }
      setIsLoadingButtonSave(false);
    });
  };
  return (
    <Form form={infoForm} onFinish={onSubmit} onValuesChange={handleFormChange}>
      <div className="text-center">
        <img src={user?.avatarUrl} alt="" width="100px" height="60px" />
        <br />
        <Button type="default" className="m-2 mb-4 text-center">
          Change image
        </Button>
      </div>
      <Form.Item
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        required={true}
        label="Name"
        name="name"
        initialValue={user?.name}
        rules={[{ required: true, message: "Please enter your name" }]}
      >
        <Input placeholder="Name" />
      </Form.Item>
      <Form.Item
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        required={true}
        label="Email"
        name="email"
        initialValue={user?.email}
        rules={[{ required: true, message: "Please enter your email" }]}
      >
        <Input placeholder="Name" />
      </Form.Item>
      <Form.Item
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        required={false}
        label="Job title"
        name="jobTitle"
        initialValue={user?.jobTitle}
      >
        <Input placeholder="Job title" />
      </Form.Item>
      <Form.Item
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        required={false}
        label="Organization"
        name="organization"
        initialValue={user?.organization}
      >
        <Input placeholder="Organization" />
      </Form.Item>
      <Form.Item
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        required={false}
        label="location"
        name="Location"
        initialValue={user?.location}
      >
        <Input placeholder="Location" />
      </Form.Item>
      <div className="mt-4">
        <Button
          type="primary"
          htmlType="submit"
          disabled={!isFormDirty}
          loading={isLoadingButtonSave}
        >
          Save
        </Button>
      </div>
    </Form>
  );
}
