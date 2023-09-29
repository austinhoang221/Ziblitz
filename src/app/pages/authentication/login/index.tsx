import { Button, Checkbox, Form, Input } from "antd";
import { AxiosResponse } from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../../../redux/slices/authenticationSlice";
import { AuthenticationService } from "../../../../services/authentication";
import { checkResponseStatus, validateEmail } from "../../../helpers";
import { IAuthentication } from "../../../models/IAuthentication";
import { IUser } from "../../../models/IUser";

export default function Login(props: any) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onSubmit = async (payload: any) => {
    const response = await AuthenticationService.logIn(payload);
    if (checkResponseStatus(response)) {
      dispatch(login(response?.data!));
      navigate("");
    }
  };

  return (
    <Form name="loginForm" className="login-form" onFinish={onSubmit}>
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Please enter your email" },
          {
            validator: validateEmail,
          },
        ]}
      >
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please enter your password" }]}
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
        <Button type="default" className="pl-4 pr-4" htmlType="submit">
          Login
        </Button>
      </div>
    </Form>
  );
}
