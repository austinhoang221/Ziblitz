import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  Form,
  Mentions,
  Menu,
  message,
  Modal,
  Select,
  Switch,
  Tooltip,
} from "antd";
import Search from "antd/es/input/Search";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getMembers,
  getPermissions,
} from "../../../../../../../../redux/slices/permissionSlice";
import {
  getProjectByCode,
  getProjectPriorities,
} from "../../../../../../../../redux/slices/projectDetailSlice";
import { RootState } from "../../../../../../../../redux/store";
import { ProjectService } from "../../../../../../../../services/projectService";
import { useAppDispatch } from "../../../../../../../customHooks/dispatch";
import useUserData from "../../../../../../../customHooks/fetchUser";
import {
  checkResponseStatus,
  convertNameToInitials,
  getRandomColor,
  sasToken,
} from "../../../../../../../helpers";
import { IPagination } from "../../../../../../../models/IPagination";
import { IUser } from "../../../../../../../models/IUser";
interface IHeaderProject {
  title: string;
  isFixedHeader: boolean;
  actionContent: ReactNode;
  onSearch: (value: string) => void;
}
export default function HeaderProject(props: IHeaderProject) {
  const initialRequestUserParam = {
    name: "",
  };
  const userId = JSON.parse(localStorage.getItem("user")!)?.id;
  const [requestUserParam, setRequestUserParam] = useState(
    initialRequestUserParam
  );

  const { project, projectPermissions } = useSelector(
    (state: RootState) => state.projectDetail
  );
  const editPermission =
    projectPermissions && projectPermissions.permissions.project.editPermission;
  const { members, permissions, isLoading } = useSelector(
    (state: RootState) => state.permissions
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoadingButtonSave, setLoadingButtonSave] = useState<boolean>(false);

  const { listUser } = useUserData(userId, requestUserParam.name);
  const ref = useRef<string>();
  const dispatch = useAppDispatch();
  const [isLoadingMention, setIsLoadingMention] = useState<boolean>(false);
  const [addMemberForm] = Form.useForm();
  const { getMentions } = Mentions;
  const [messageApi, contextHolder] = message.useMessage();

  const [permissionId, setPermissionId] = useState<string>("");

  const showSuccessMessage = () => {
    messageApi.open({
      type: "success",
      content: "Successfully",
    });
  };

  useEffect(() => {
    if (project?.id) {
      dispatch(getProjectPriorities(project?.id));
    }
  }, [project?.id, dispatch]);

  useEffect(() => {
    if (project?.id) {
      if (!members || members?.length === 0) dispatch(getMembers(project?.id!));
      if (!permissions || permissions?.length === 0)
        dispatch(getPermissions(project?.id!));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id]);

  useEffect(() => {
    setPermissionId(permissions?.find((item) => item.id)?.id ?? "");
  }, [permissions]);

  const onClickCancel = () => {
    setIsModalOpen(false);
    addMemberForm.resetFields();
  };
  const onClickOpenModal = () => {
    setIsModalOpen(true);
  };

  const onClickOk = () => {
    const mentions = getMentions(addMemberForm.getFieldValue("name"));
    if (mentions?.length > 0) {
      setLoadingButtonSave(true);
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
        permissionGroupId: permissionId,
      };
      ProjectService.addMember(userId, payload).then((res) => {
        if (checkResponseStatus(res)) {
          dispatch(getProjectByCode(project?.code!));
          onClickCancel();
          setLoadingButtonSave(false);
          showSuccessMessage();
          dispatch(getMembers(project?.id!));
          dispatch(getPermissions(project?.id!));
        }
      });
    }
  };

  const onSearchUser = (search: string) => {
    ref.current = search;
    setIsLoadingMention(true);
    setTimeout(() => {
      setRequestUserParam({ name: search });
      setIsLoadingMention(false);
    }, 300);
  };

  const onSearch = (search: string) => {
    props.onSearch(search);
  };

  const getOptionLabel = (user: IUser) => (
    <>
      <Avatar
        style={{ backgroundColor: getRandomColor(), verticalAlign: "middle" }}
        size={28}
        className="mr-2"
        alt=""
        src={user.avatarUrl + sasToken}
      >
        {convertNameToInitials(user.name)}
      </Avatar>
      <span>{user.email}</span>
    </>
  );

  const getOptions = () => {
    const mentions = getMentions(addMemberForm.getFieldValue("name"));
    return listUser
      .filter(
        (user) =>
          !project?.members.some((member) => member.id === user.id) &&
          user.id !== project?.leader.id &&
          !mentions.some((mention) => mention.value === user.email)
      )
      .map((user: IUser) => {
        return {
          key: user.id,
          label: getOptionLabel(user),
          value: user.email,
        };
      });
  };

  return (
    <>
      {contextHolder}
      <div className="align-child-space-between align-center">
        <h1 className="mb-0 mt-2">{props.title}</h1>
      </div>
      <div className="d-flex mt-2 flex-wrap ">
        <Search
          className="mr-2 mb-2"
          placeholder="Search..."
          style={{ width: 200 }}
          onSearch={(value) => onSearch(value)}
        />
        {props.isFixedHeader && (
          <>
            <Avatar.Group className="mr-2">
              <>
                <Tooltip title={project?.leader.name} placement="top">
                  <Avatar
                    className="cursor-pointer"
                    src={project?.leader.avatarUrl + sasToken}
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
                    <Tooltip
                      title={member?.name}
                      placement="top"
                      key={member.id}
                    >
                      <Avatar
                        className="cursor-pointer"
                        src={member?.avatarUrl + sasToken}
                      ></Avatar>
                    </Tooltip>
                  );
                })}
              </>
            </Avatar.Group>
            {editPermission && (
              <Button
                shape="circle"
                onClick={onClickOpenModal}
                icon={<i className="fa-solid fa-user-plus"></i>}
              />
            )}
          </>
        )}
        {props.actionContent}

        <Modal
          title="Add member"
          open={isModalOpen}
          onOk={onClickOk}
          confirmLoading={isLoadingButtonSave}
          onCancel={onClickCancel}
        >
          <Form form={addMemberForm}>
            <Form.Item
              label="Name, email or group"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              name="name"
              required
              rules={[
                {
                  required: true,
                  message: "Please add users",
                },
              ]}
            >
              <Mentions
                loading={isLoadingMention || isLoading}
                onSearch={onSearchUser}
                options={getOptions()}
              ></Mentions>
            </Form.Item>
            <Form.Item
              label="Permission"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              name="permission"
              required
              rules={[
                {
                  required: true,
                  message: "Please choose permission",
                },
              ]}
            >
              <Select
                loading={isLoading}
                onChange={setPermissionId}
                defaultValue={permissions?.find((item) => item.id)?.id}
                options={permissions?.map((permission) => {
                  return {
                    key: permission.id,
                    label: permission.name,
                    value: permission.id,
                    disabled:
                      (permission.name === "Product Owner" &&
                        members.some(
                          (member) =>
                            permissions?.find(
                              (permission) =>
                                permission.name === "Product Owner"
                            )?.id === member.permissionGroupId
                        )) ||
                      (permission.name === "Scrum Master" &&
                        members.some(
                          (member) =>
                            permissions?.find(
                              (permission) => permission.name === "Scrum Master"
                            )?.id === member.permissionGroupId
                        )),
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
