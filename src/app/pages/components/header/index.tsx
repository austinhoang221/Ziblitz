import {
  Avatar,
  Button,
  Divider,
  Dropdown,
  Menu,
  MenuProps,
  Space,
  Tabs,
  TabsProps,
} from "antd";
import Search from "antd/es/input/Search";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../../redux/slices/authenticationSlice";
import { getFilterIssue } from "../../../../redux/slices/filterSlice";
import {
  getMembers,
  getPermissions,
} from "../../../../redux/slices/permissionSlice";
import { RootState } from "../../../../redux/store";
import { useAppDispatch } from "../../../customHooks/dispatch";
import { IFilter } from "../../../models/IFilter";
import { IProject } from "../../../models/IProject";
import CreateProjectDrawer from "../../content/project/partials/create";
import ButtonIcon from "../button-icon";
import "./index.scss";
import AssignToMeTask from "./partials/assign-to-me-task";
import RecentTask from "./partials/recent-task";
export default function Header() {
  const [defaultTabIndex, setDefaultTabIndex] = useState<string>("1");
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = JSON.parse(localStorage.getItem("user")!);

  const projects = useSelector((state: RootState) => state.projects);
  const { filters } = useSelector((state: RootState) => state.filters);
  const currentProject = useSelector(
    (state: RootState) => state.projectDetail.project
  );

  const dashboardItems: MenuProps["items"] = [
    {
      key: "1",
      label: "View all dashboards",
    },
    {
      key: "2",
      label: "Create dashboard",
    },
  ];

  const teamItems: MenuProps["items"] = [
    {
      key: "1",
      label: "Invite people to Jira",
    },
    {
      key: "2",
      label: "Create a team",
    },
  ];
  const yourWorkTabs: TabsProps["items"] = [
    {
      key: "1",
      label: "Assign to me",
      children: <AssignToMeTask />,
    },
    {
      key: "2",
      label: "Recent",
      children: <RecentTask />,
    },
  ];

  useEffect(() => {
    if (!filters || filters?.length === 0) {
      dispatch(getFilterIssue());
    }
  }, []);

  const onClickLogout = () => {
    dispatch(logout());
    navigate("login");
  };
  const goToProject = () => {
    navigate("project");
  };
  const goToDetailProject = (project: IProject) => {
    dispatch(getPermissions(project?.id));
    dispatch(getMembers(project?.id));
    navigate(`project/${project?.code}/backlog`);
  };

  const goToDetailFilter = (filter: IFilter) => {
    navigate("/issues/" + filter.id);
  };
  const goToCreateProject = () => {
    setIsDrawerOpen(true);
  };

  const onNavigateUser = (id: string) => {
    navigate(`user/${id}`);
  };
  return (
    <>
      <nav className="c-header">
        <div className="d-flex align-center">
          <img
            src={require("../../../assets/images/logo.png")}
            alt=""
            width="30px"
            height="30px"
            className="ml-4 mr-4"
          />
          <div className="d-flex align-center">
            <div className="c-header-dropdown-item">
              <Dropdown
                trigger={["click"]}
                overlayStyle={{
                  margin: "20px",
                  inset: "35px auto auto 62px",
                  width: "300px",
                }}
                overlay={
                  <Menu>
                    <Tabs
                      className="pr-3 pl-3"
                      activeKey={defaultTabIndex}
                      items={yourWorkTabs}
                      onChange={setDefaultTabIndex}
                    />
                  </Menu>
                }
              >
                <Button type="text" onClick={(e) => e.preventDefault()}>
                  <Space>Your works</Space>
                  <i className="fa-solid fa-angle-down ml-2"></i>
                </Button>
              </Dropdown>
            </div>
            <div className="c-header-dropdown-item">
              <Dropdown
                trigger={["click"]}
                overlayStyle={{ width: "200px" }}
                overlay={
                  <Menu
                    title="Recent"
                    selectedKeys={[currentProject?.id ?? ""]}
                  >
                    {projects.map((project) => {
                      return (
                        <Menu.Item
                          key={project.id}
                          onClick={() => goToDetailProject(project)}
                        >
                          <div className="align-child-space-between align-center">
                            <div className="d-flex">
                              <img
                                width="20px"
                                height="20px"
                                className="mr-2"
                                src={project.avatarUrl}
                                alt=""
                              />
                              <div className="text-truncate">
                                <span>
                                  {project.name} ({project.code})
                                </span>
                              </div>
                            </div>
                            {project.isFavourite && (
                              <ButtonIcon
                                iconClass={
                                  project.isFavourite
                                    ? "fa-solid fa-star"
                                    : "fa-regular fa-star"
                                }
                              ></ButtonIcon>
                            )}
                          </div>
                        </Menu.Item>
                      );
                    })}

                    <Divider className="mb-0 mt-0"></Divider>
                    <Menu.Item onClick={goToProject}>
                      <span>View all projects</span>
                    </Menu.Item>
                    <Menu.Item onClick={goToCreateProject}>
                      <span>Create projects</span>
                    </Menu.Item>
                  </Menu>
                }
              >
                <Button type="text" onClick={(e) => e.preventDefault()}>
                  <Space>Projects</Space>
                  <i className="fa-solid fa-angle-down ml-2"></i>
                </Button>
              </Dropdown>
            </div>
            <div className="c-header-dropdown-item">
              <Dropdown
                overlay={
                  <Menu>
                    {filters.slice(0, 3)?.map((filter) => {
                      return (
                        <Menu.Item
                          key={filter.id}
                          onClick={() => goToDetailFilter(filter)}
                        >
                          <span>{filter.name}</span>
                        </Menu.Item>
                      );
                    })}
                    <Divider className="mb-0 mt-0"></Divider>

                    <Menu.Item onClick={() => navigate("/filters")}>
                      <span>View all filter</span>
                    </Menu.Item>
                    <Menu.Item onClick={() => navigate("/issues/new")}>
                      <span>View all issue</span>
                    </Menu.Item>
                  </Menu>
                }
                trigger={["click"]}
              >
                <Button type="text" onClick={(e) => e.preventDefault()}>
                  <Space>Filters</Space>
                  <i className="fa-solid fa-angle-down ml-2"></i>
                </Button>
              </Dropdown>
            </div>
            <div className="c-header-dropdown-item">
              <Dropdown
                overlay={<Menu items={dashboardItems}></Menu>}
                trigger={["click"]}
              >
                <Button type="text" onClick={(e) => e.preventDefault()}>
                  <Space>Dashboards</Space>
                  <i className="fa-solid fa-angle-down ml-2"></i>
                </Button>
              </Dropdown>
            </div>
            <div className="c-header-dropdown-item">
              <Dropdown
                overlay={<Menu items={teamItems}></Menu>}
                trigger={["click"]}
              >
                <Button type="text" onClick={(e) => e.preventDefault()}>
                  <Space>Teams</Space>
                  <i className="fa-solid fa-angle-down ml-2"></i>
                </Button>
              </Dropdown>
            </div>
            {/* <Button type="primary" className="ml-2">
              Create
            </Button> */}
          </div>
        </div>
        <div className="c-header-config">
          <Search placeholder="Search..." style={{ width: 200 }} />
          <ButtonIcon iconClass="fa-solid fa-bell"></ButtonIcon>
          <ButtonIcon iconClass="fa-solid fa-gear"></ButtonIcon>
          <Dropdown
            trigger={["click"]}
            overlay={
              <Menu title="Account">
                <Menu.Item onClick={() => onNavigateUser(user?.id)}>
                  <div className="d-flex align-center">
                    <Avatar
                      size={40}
                      className="mr-2"
                      src={user?.avatarUrl}
                    ></Avatar>
                    <div className="">
                      <h5 className="mt-0 mb-0">{user?.name}</h5>
                      <p className="mt-0 mb-0">{user?.email}</p>
                    </div>
                  </div>
                </Menu.Item>
                <Menu.Item onClick={onClickLogout}>
                  <span>Log out</span>
                </Menu.Item>
              </Menu>
            }
          >
            <Avatar
              className="mr-2 ml-2 cursor-pointer"
              src={user?.avatarUrl}
            ></Avatar>
          </Dropdown>
        </div>
      </nav>

      <CreateProjectDrawer
        isDrawerOpen={isDrawerOpen}
        setOpen={(isOpen: boolean) => setIsDrawerOpen(isOpen)}
      />
    </>
  );
}
