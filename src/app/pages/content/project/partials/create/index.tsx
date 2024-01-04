import { Button, Col, Drawer, Form, Input, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProject } from "../../../../../../redux/slices/projectSlice";
import { ProjectService } from "../../../../../../services/projectService";
import { checkResponseStatus } from "../../../../../helpers";
import { IProject } from "../../../../../models/IProject";
import "./index.scss";
export default function CreateProjectDrawer(props: any) {
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  const [isLoadingButtonSave, setIsLoadingButtonSave] = useState(false);
  const [drawerForm] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onClickCancel = () => {
    drawerForm.resetFields();
    props.setOpen(false);
  };

  const onSubmit = async () => {
    setIsLoadingButtonSave(true);
    const drawerFormValue = drawerForm.getFieldsValue();
    try {
      await drawerForm.validateFields();
      setIsLoadingButtonSave(true);

      const payload: IProject = {
        ...drawerFormValue,
        avatarUrl: "",
        isFavorite: false,
      };
      const response = await ProjectService.create(userId, payload);
      if (checkResponseStatus(response)) {
        dispatch(createProject(response!.data));
        navigate(`/project/${response!.data.code}/board`);
        window.location.reload();
        onClickCancel();
      }
      setIsLoadingButtonSave(false);
    } catch (error) {
      console.error("Form validation error:", error);
      setIsLoadingButtonSave(false);
    }
  };

  return (
    <>
      <Drawer
        title="Create project"
        width="100%"
        placement="right"
        onClose={onClickCancel}
        open={props.isDrawerOpen}
        footer={
          <Footer
            onClickCancel={onClickCancel}
            onSubmit={onSubmit}
            isLoadingButtonSave={isLoadingButtonSave}
          />
        }
      >
        <div className="c-main">
          <Row gutter={48}>
            <Col span={12}>
              <h1>Add project details</h1>
              <p>
                Explore what's possible when you collaborate with your team.
                Edit project details anytime in project settings.
              </p>
              <Form
                form={drawerForm}
                className="login-form"
                onFinish={onSubmit}
              >
                <Form.Item
                  label="Name"
                  required={true}
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your project name",
                    },
                  ]}
                >
                  <Input placeholder="Try a team name. project goal, milestone,..." />
                </Form.Item>
                <Form.Item
                  label="Key"
                  tooltip="Choose a descriptive prefix for your project’s issue keys to recognize work from this project."
                  required={true}
                  name="code"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your project key",
                    },
                  ]}
                >
                  <Input type="text" />
                </Form.Item>
                <Form.Item label="Description" name="description">
                  <TextArea />
                </Form.Item>
              </Form>
            </Col>
            <Col span={12}>
              <h3>Template</h3>
              <div className="d-flex align-center c-main-card">
                <div className="p-4" style={{ backgroundColor: "#f4f5f7" }}>
                  <div className="c-main-template"></div>
                </div>
                <div className="ml-3 pr-2">
                  <span className="font-weight-bold">Scrum</span>
                  <p className="mt-0">
                    Sprint toward your project goals with a board, backlog, and
                    timeline.
                  </p>
                </div>
              </div>
              <h3>Type</h3>
              <div className="d-flex align-center c-main-card">
                <div className="p-4" style={{ backgroundColor: "#f4f5f7" }}>
                  <div className="c-main-type"></div>
                </div>
                <div className="ml-3">
                  <span className="font-weight-bold">Team-managed</span>
                  <p className="mt-0">
                    Control your own working processes, practices in a
                    self-contained space.
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Drawer>
    </>
  );
}

function Footer(props: any) {
  return (
    <>
      <div className="float-right">
        <Button type="default" onClick={props.onClickCancel}>
          Cancel
        </Button>
        <Button
          className="ml-2"
          type="primary"
          onClick={props.onSubmit}
          htmlType="submit"
          loading={props.isLoadingButtonSave}
        >
          Create project
        </Button>
      </div>
    </>
  );
}
