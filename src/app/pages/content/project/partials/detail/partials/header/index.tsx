import {
  Avatar,
  Button,
  Dropdown,
  Form,
  Mentions,
  Menu,
  Modal,
  Select,
  Tooltip,
} from "antd";
import Search from "antd/es/input/Search";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProjectDetail } from "../../../../../../../../redux/slices/projectDetailSlice";
import { updateProject } from "../../../../../../../../redux/slices/projectSlice";
import { RootState } from "../../../../../../../../redux/store";
import { ProjectService } from "../../../../../../../../services/projectService";
import useRoleData from "../../../../../../../customHooks/fetchRole";
import useUserData from "../../../../../../../customHooks/fetchUser";
import {
  checkResponseStatus,
  convertNameToInitials,
  getRandomColor,
} from "../../../../../../../helpers";
import { IUser } from "../../../../../../../models/IUser";

export default function HeaderProject(props: any) {
  const initialRequestUserParam = {
    name: "",
  };
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );
  const [requestUserParam, setRequestUserParam] = useState(
    initialRequestUserParam
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { listUser, refreshData } = useUserData(userId, requestUserParam.name);
  const { listRole } = useRoleData();
  const ref = useRef<string>();
  const dispatch = useDispatch();
  const [isLoadingMention, setIsLoadingMention] = useState<boolean>(false);
  const [addMemberForm] = Form.useForm();
  const { getMentions } = Mentions;
  const onClickCancel = () => {
    setIsModalOpen(false);
  };
  const onClickOpenModal = () => {
    setIsModalOpen(true);
  };
  const onClickOk = () => {
    const mentions = getMentions(addMemberForm.getFieldValue("name"));
    const role = addMemberForm.getFieldValue("role");
    let userIds: string[] = [];
    mentions.forEach((mention) => {
      const user = listUser.find((user) => user.email === mention.value);
      userIds.push(user?.id!);
    });
    const payload = {
      projectId: project?.id,
      role: role,
      userIds: userIds,
    };
    ProjectService.addMember(userId, payload).then((res) => {
      if (checkResponseStatus(res)) {
        dispatch(setProjectDetail(res?.data!));
        dispatch(updateProject(res?.data!));
      }
    });
  };

  const onSearch = (search: string) => {
    ref.current = search;
    setIsLoadingMention(true);
    setTimeout(() => {
      setRequestUserParam({ name: search });
      setIsLoadingMention(false);
    }, 300);
  };

  const getOptionLabel = (user: IUser) => (
    <>
      <Avatar
        style={{ backgroundColor: getRandomColor(), verticalAlign: "middle" }}
        size={28}
        className="mr-2"
        alt=""
        src={user.avatarUrl}
      >
        {convertNameToInitials(user.name)}
      </Avatar>
      <span>{user.email}</span>
    </>
  );
  return (
    <>
      <div className="align-child-space-between align-center">
        <h1 className="mb-0">Backlog</h1>
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item>
                <div onClick={(e) => e.stopPropagation()}>
                  Manage custom filter
                </div>
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
      <div className="d-flex align-center mt-2">
        <Search
          className="mr-2"
          placeholder="Search..."
          style={{ width: 200 }}
        />
        <Avatar.Group className="mr-2">
          <>
            <Tooltip title={project?.leader.name} placement="top">
              <Avatar
                className="cursor-pointer"
                src={project?.leader.avatarUrl}
                style={{
                  backgroundColor: getRandomColor(),
                  verticalAlign: "middle",
                }}
              >
                {convertNameToInitials(project?.leader.name!)}
              </Avatar>
            </Tooltip>
            {project?.members?.map((member) => {
              return (
                <Tooltip title={member?.name} placement="top" key={member.id}>
                  <Avatar
                    className="cursor-pointer"
                    src={member?.avatarUrl}
                    style={{
                      backgroundColor: getRandomColor(),
                      verticalAlign: "middle",
                    }}
                  >
                    {convertNameToInitials(member.name)}
                  </Avatar>
                </Tooltip>
              );
            })}
          </>
        </Avatar.Group>
        <Button
          shape="circle"
          onClick={onClickOpenModal}
          icon={<i className="fa-solid fa-user-plus"></i>}
        />
        <Modal
          title="Add member"
          open={isModalOpen}
          onOk={onClickOk}
          onCancel={onClickCancel}
        >
          <Form form={addMemberForm}>
            <Form.Item
              label="Name, email or group"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              name="name"
            >
              <Mentions
                loading={isLoadingMention}
                onSearch={onSearch}
                options={listUser.map((user: IUser) => {
                  return {
                    key: user.id,
                    label: getOptionLabel(user),
                    value: user.email,
                  };
                })}
              ></Mentions>
            </Form.Item>
            <Form.Item
              label="Role"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              name="role"
            >
              <Select
                defaultValue={listRole.find((item) => item.id)?.id}
                options={listRole.map((role) => {
                  return {
                    key: role.id,
                    label: role.name,
                    value: role.id,
                  };
                })}
              ></Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
}
