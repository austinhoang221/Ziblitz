import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { UserService } from "../../../../../services/userService";
import { checkResponseStatus } from "../../../../helpers";

export default function UserPassword(props: any) {
  const { user, onSaveSuccess } = props;
  const [infoForm] = Form.useForm();
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);
  const [isLoadingButtonSave, setIsLoadingButtonSave] =
    useState<boolean>(false);

  const onSubmit = () => {
    const payload = {
      id: user?.id!,
      currentPassword: infoForm.getFieldValue("currentPassword"),
      newPassword: infoForm.getFieldValue("newPassword"),
    };
    setIsLoadingButtonSave(true);
    UserService.changePassword(user?.id, payload).then((res) => {
      if (checkResponseStatus(res)) {
        setIsFormDirty(false);
        props.onSaveSuccess();
      }
      setIsLoadingButtonSave(false);
    });
  };

  const handleFormChange = () => {
    if (!isFormDirty) {
      setIsFormDirty(true); // Mark the form as dirty when changes occur
    }
  };

  return (
    <Form form={infoForm} onFinish={onSubmit} onValuesChange={handleFormChange}>
      <Form.Item
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        required={true}
        label="Current password"
        name="currentPassword"
        rules={[
          { required: true, message: "Please enter your current password" },
        ]}
      >
        <Input placeholder="Current password" />
      </Form.Item>
      <Form.Item
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        required={true}
        label="New password"
        name="newPassword"
        initialValue={user?.password}
        rules={[{ required: true, message: "Please enter your new password" }]}
      >
        <Input placeholder="New password" />
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
