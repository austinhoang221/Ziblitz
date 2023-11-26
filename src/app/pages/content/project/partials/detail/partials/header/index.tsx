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
  getProjectByCode,
  getProjectPriorities,
  setIsShowEpic,
} from "../../../../../../../../redux/slices/projectDetailSlice";
import { RootState } from "../../../../../../../../redux/store";
import { ProjectService } from "../../../../../../../../services/projectService";
import { useAppDispatch } from "../../../../../../../customHooks/dispatch";
import useRoleData from "../../../../../../../customHooks/fetchRole";
import useUserData from "../../../../../../../customHooks/fetchUser";
import {
  checkResponseStatus,
  convertNameToInitials,
  getRandomColor,
} from "../../../../../../../helpers";
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { listUser } = useUserData(userId, requestUserParam.name);
  const { listRole } = useRoleData();
  const ref = useRef<string>();
  const dispatch = useAppDispatch();
  const [isLoadingMention, setIsLoadingMention] = useState<boolean>(false);
  const [addMemberForm] = Form.useForm();
  const { getMentions } = Mentions;
  const [messageApi, contextHolder] = message.useMessage();
  const { isShowEpic, project } = useSelector(
    (state: RootState) => state.projectDetail
  );
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
        dispatch(getProjectByCode(project?.code!));
        setIsModalOpen(false);
        showSuccessMessage();
      }
    });
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
        src={user.avatarUrl}
      >
        {convertNameToInitials(user.name)}
      </Avatar>
      <span>{user.email}</span>
    </>
  );

  const onChangeToggleEpic = (e: any) => {
    dispatch(setIsShowEpic(e));
  };
  return (
    <>
      {contextHolder}
      <div className="align-child-space-between align-center">
        <h1 className="mb-0 mt-2">{props.title}</h1>
        {props.actionContent}
      </div>
      <div className="d-flex align-center mt-2">
        <Search
          className="mr-2"
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
                    <Tooltip
                      title={member?.name}
                      placement="top"
                      key={member.id}
                    >
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

            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Select
                        mode="multiple"
                        allowClear
                        style={{ width: "250px" }}
                        placeholder="Please select"
                        // onChange={handleChange}
                        options={project?.epics.map((epic) => {
                          return {
                            label: <span>{epic.name}</span>,
                            value: epic.id,
                          };
                        })}
                      />
                      <Divider className="mt-2 mb-2"></Divider>
                      <div className="d-flex">
                        <Switch
                          checked={isShowEpic}
                          onChange={(e) => onChangeToggleEpic(e)}
                        />
                        <span className="ml-2">Epic</span>
                      </div>
                    </div>
                  </Menu.Item>
                </Menu>
              }
              trigger={["click"]}
            >
              <Button type="text" className="ml-2">
                <span>Epic</span>{" "}
                <i className="fa-solid fa-chevron-down ml-2"></i>
              </Button>
            </Dropdown>
          </>
        )}

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
                onSearch={onSearchUser}
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
