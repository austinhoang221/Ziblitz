import { Button, Checkbox, Form, Input, Tooltip } from "antd";
import React from "react";
import { AuthenticationService } from "../../../../services/authentication";
import { validateEmail, validatePassword } from "../../../helpers";
import { InfoCircleOutlined } from '@ant-design/icons';
export default function SignUp(props: any) {
  const onSubmit = async (payload: any) => {
    await AuthenticationService.signUp(payload);
    
  };
  const regexHint = "The password must be 6 characters long and include at least one uppercase letter (A-Z), one numeric digit (0-9), and one special character."
  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onSubmit}
    >
       <Form.Item
        name="username"
        rules={[
          { required: true, message: "Please input your user name" },
        ]}
      >
        <Input placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="email"
        hasFeedback
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
        rules={[{ required: true, message: "Please input your password" },
        { validator: validatePassword},
      ]}
        hasFeedback
      >
        <Input type="password" placeholder="Password" 
        suffix={
          <Tooltip title={regexHint}>
            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
          </Tooltip>
        }/>
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        hasFeedback
        rules={[
          { required: true, message: "Please input your confirm password" },
          { validator: validatePassword},
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error());
            },
          }),
        ]}
      >
        <Input type="password" placeholder="Confirm password" />
      </Form.Item>
      <Form.Item>
        <a className="login-form-forgot" onClick={props.goToLogin}>
          Already have account?
        </a>
      </Form.Item>

      <div className="text-center text-lg-start mt-4 pt-2">
        <Button type="default" className="pl-2 pr-2" htmlType="submit">
          Sign up
        </Button>
      </div>
    </Form>
  );
}
