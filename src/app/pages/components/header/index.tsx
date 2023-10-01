import {
  Button,
  Dropdown,
  Menu,
  MenuProps,
  Space,
  Tabs,
  TabsProps,
} from "antd";
import Search from "antd/es/input/Search";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonIcon from "../button-icon";
import "./index.scss";
import AssignToMeTask from "./partials/assign-to-me-task";
import Board from "./partials/board";
import RecentTask from "./partials/recent-task";
export default function Header() {
  const [defaultTabIndex, setDefaultTabIndex] = useState<string>("1");
  const navigate = useNavigate();
  const goToProject = () => {
    navigate("project");
  };
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "View all projects",
      onClick: (e: any) => goToProject(),
    },
    {
      key: "2",
      label: "Create projects",
    },
  ];
  const filterItems: MenuProps["items"] = [
    {
      key: "1",
      label: "View all filters",
    },
    {
      key: "2",
      label: "Create filter",
    },
  ];
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
    {
      key: "3",
      label: "Board",
      children: <Board />,
    },
  ];
  const fetchProject = () => {
    const projects = UserService.get;
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
              <Dropdown menu={{ items }} trigger={["click"]}>
                <Button type="text" onClick={(e) => e.preventDefault()}>
                  <Space>Project</Space>
                  <i className="fa-solid fa-angle-down ml-2"></i>
                </Button>
              </Dropdown>
            </div>
            <div className="c-header-dropdown-item">
              <Dropdown
                overlay={<Menu items={filterItems}></Menu>}
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
            <Button type="primary" className="ml-2">
              Create
            </Button>
          </div>
        </div>
        <div className="c-header-config">
          <Search placeholder="Search..." style={{ width: 200 }} />
          <ButtonIcon iconClass="fa-solid fa-bell"></ButtonIcon>
          <ButtonIcon iconClass="fa-solid fa-gear"></ButtonIcon>
          {/* <img src="" alt="" /> */}
        </div>
      </nav>
    </>
  );
}
