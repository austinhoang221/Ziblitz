import { Button, Form, Input, Tooltip } from "antd";
import { AuthenticationService } from "../../../../services/authentication";
import {
  checkResponseStatus,
  validateEmail,
  validatePassword,
} from "../../../helpers";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../../../redux/slices/authenticationSlice";
export default function SignUp(props: any) {
  const dispatch = useDispatch();
  const onSubmit = async (payload: any) => {
    const response = await AuthenticationService.signUp(payload);
    if (checkResponseStatus(response)) {
      dispatch(login(response?.data!));
    }
  };
  const regexHint =
    "The password must be 6 characters long and include at least one uppercase letter (A-Z), one numeric digit (0-9), and one special character.";
  return (
    <Form
      name="signUpForm"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onSubmit}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: "Please input your user name" }]}
      >
        <Input placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="email"
        hasFeedback
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
        hasFeedback
        rules={[
          { required: true, message: "Please enter your confirm password" },
          { validator: validatePassword },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
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
