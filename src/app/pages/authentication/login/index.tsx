import { Button, Checkbox, Form, Input } from "antd";
import React from "react";
import { validateEmail } from "../../../helpers";

export default function Login(props: any) {
  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={props.onSubmit}
    >
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Please input your email" },
          {
            validator: validateEmail,
          },
        ]}
      >
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your password" }]}
      >
        <Input type="password" placeholder="Password" />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <a className="login-form-forgot" onClick={props.goToSignUp}>
          Dont have account?
        </a>
      </Form.Item>

      <div className="text-center text-lg-start mt-4 pt-2">
        <Button type="default" className="pl-4 pr-4">
          Login
        </Button>
      </div>
    </Form>
  );
}
