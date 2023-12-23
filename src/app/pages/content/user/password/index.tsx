import { Button, Form, Input, Tooltip } from "antd";
import React, { useState } from "react";
import { UserService } from "../../../../../services/userService";
import { checkResponseStatus, validatePassword } from "../../../../helpers";
import { InfoCircleOutlined } from "@ant-design/icons";

export default function UserPassword(props: any) {
  const { user, onSaveSuccess, onFailed } = props;
  const [infoForm] = Form.useForm();
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);
  const [isLoadingButtonSave, setIsLoadingButtonSave] =
    useState<boolean>(false);
  const regexHint =
    "The password must be 6 characters long and include at least one uppercase letter (A-Z), one numeric digit (0-9), and one special character.";

  const onSubmit = () => {
    const payload = {
      currentPassword: infoForm.getFieldValue("currentPassword"),
      newPassword: infoForm.getFieldValue("newPassword"),
    };
    setIsLoadingButtonSave(true);
    UserService.changePassword(user?.id, payload).then((res) => {
      if (checkResponseStatus(res)) {
        setIsFormDirty(false);
        onSaveSuccess();
      } else {
        onFailed("Password incorrect");
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
        <Input placeholder="Current password" type="password" />
      </Form.Item>
      <Form.Item
        label="New password"
        name="newPassword"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        rules={[
          { required: true, message: "Please enter your password" },
          { validator: validatePassword },
        ]}
        hasFeedback
      >
        <Input
          type="password"
          placeholder="Password"
          suffix={
            <Tooltip title={regexHint}>
              <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
            </Tooltip>
          }
        />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        label="Confirm password"
        hasFeedback
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        rules={[
          { required: true, message: "Please enter your confirm password" },
          { validator: validatePassword },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("newPassword") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("The new password that you entered do not match")
              );
            },
          }),
        ]}
      >
        <Input type="password" placeholder="Confirm password" />
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
