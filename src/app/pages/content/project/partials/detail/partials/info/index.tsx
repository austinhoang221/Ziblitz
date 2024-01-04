import {
  Avatar,
  Button,
  Dropdown,
  Form,
  Input,
  Menu,
  message,
  Popconfirm,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setBacklogIssues,
  setProjectDetail,
} from "../../../../../../../../redux/slices/projectDetailSlice";
import { updateProject } from "../../../../../../../../redux/slices/projectSlice";
import { RootState } from "../../../../../../../../redux/store";
import { ProjectService } from "../../../../../../../../services/projectService";
import {
  checkResponseStatus,
  convertNameToInitials,
  getRandomColor,
  sasToken,
} from "../../../../../../../helpers";
import { IUser } from "../../../../../../../models/IUser";
import "./index.scss";
export default function InfoProject() {
  const [infoForm] = Form.useForm();
  const [isFormDirty, setIsFormDirty] = useState<boolean>(false);
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;

  const [isLoadingButtonSave, setIsLoadingButtonSave] =
    useState<boolean>(false);
  const { project, projectPermissions } = useSelector(
    (state: RootState) => state.projectDetail
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    infoForm.setFieldsValue(project);
    infoForm.resetFields();
  }, [project]);
  const editPermission =
    projectPermissions && projectPermissions.permissions.project.editPermission;
  const [messageApi, contextHolder] = message.useMessage();
  const showSuccessMessage = () => {
    messageApi.open({
      type: "success",
      content: "Successfully",
    });
  };
  const onSubmit = () => {
    const payload = {
      id: project?.id!,
      name: infoForm.getFieldValue("name"),
      code: infoForm.getFieldValue("code"),
      description: infoForm.getFieldValue("description"),
      avatarUrl: "",
      leaderId: infoForm.getFieldValue("leaderId"),
      defaultAssigneeId: infoForm.getFieldValue("defaultAssigneeId"),
    };
    setIsLoadingButtonSave(true);
    ProjectService.update(userId, payload, payload.id).then((res) => {
      if (checkResponseStatus(res)) {
        setIsFormDirty(false);
        dispatch(setProjectDetail(res?.data!));
        dispatch(setBacklogIssues(res?.data.backlog.issues!));
        dispatch(updateProject(res?.data!));
        showSuccessMessage();
      }
      setIsLoadingButtonSave(false);
    });
  };

  const getOptionLabel = (user: IUser) => (
    <>
      <Avatar
        size={28}
        className="mr-2"
        alt=""
        src={user?.avatarUrl + sasToken}
      ></Avatar>
      <span>{user.name}</span>
    </>
  );
  const handleFormChange = () => {
    if (!isFormDirty) {
      setIsFormDirty(true); // Mark the form as dirty when changes occur
    }
  };
  const onClickDeleteProject = (e: any) => {
    ProjectService.delete(userId, project?.id!).then((res) => {
      if (checkResponseStatus(res)) {
        navigate("/project");
        dispatch(setProjectDetail(null));
        dispatch(setBacklogIssues([]));
      }
    });
  };

  const onRenderMember = () => {
    const members = project?.members ? [...project?.members] : [];
    if (members) {
      members.unshift(project?.leader!);
    }
    return members;
  };
  return (
    <>
      <div className="align-child-space-between align-center">
        <h1 className="mb-0">Details</h1>
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item>
                <Popconfirm
                  title="Delete the project"
                  description="Are you sure to delete this project?"
                  okText="Yes"
                  cancelText="Cancel"
                  onConfirm={onClickDeleteProject}
                >
                  <div onClick={(e) => e.stopPropagation()}>Move to trash</div>
                </Popconfirm>
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <Button type="text" onClick={(e) => e.preventDefault()}>
            <i className="fa-solid fa-ellipsis"></i>
          </Button>
        </Dropdown>
      </div>
      <div className="c-detail">
        <div className="text-center">
          <img src={project?.avatarUrl} alt="" width="100px" height="60px" />
          <br />
          {editPermission && (
            <Button type="default" className="m-2 mb-4 text-center">
              Change image
            </Button>
          )}
        </div>
        <Form
          form={infoForm}
          onFinish={onSubmit}
          onValuesChange={handleFormChange}
        >
          <Form.Item
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            required={false}
            label="Name"
            name="name"
            initialValue={project?.name}
            rules={[{ required: true, message: "Please enter project name" }]}
          >
            <Input placeholder="Name" disabled={!editPermission} />
          </Form.Item>
          <Form.Item
            label="Key"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            required={false}
            name="code"
          >
            <Input
              placeholder="Key"
              defaultValue={project?.code}
              disabled={true}
            />
          </Form.Item>
          <Form.Item
            label="Leader"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            required={false}
            name="leaderId"
          >
            <Select
              disabled={true}
              defaultValue={project?.leader?.id}
              onChange={handleFormChange}
              options={onRenderMember().map((user) => {
                return {
                  label: getOptionLabel(user),
                  value: user.id,
                };
              })}
            ></Select>
          </Form.Item>
          <Form.Item
            label="Default assignee"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            required={false}
            name="defaultAssigneeId"
            initialValue={project?.projectConfiguration?.defaultAssigneeId}
          >
            <Select
              disabled={!editPermission}
              onChange={handleFormChange}
              options={onRenderMember().map((user) => {
                return {
                  label: getOptionLabel(user),
                  value: user.id,
                };
              })}
            ></Select>
          </Form.Item>
          {editPermission && (
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
          )}
        </Form>
      </div>
      {contextHolder}
    </>
  );
}
