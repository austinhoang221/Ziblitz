import { Breadcrumb, Layout, Menu, Tooltip } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import React, { useEffect } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import "./index.scss";
import SubMenu from "antd/es/menu/SubMenu";
import { getProjectByCode } from "../../../../../../redux/slices/projectDetailSlice";
import { useAppDispatch } from "../../../../../customHooks/dispatch";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../redux/store";
export default function DetailProject() {
  const params = useParams();
  const pathname = window.location.pathname;
  const segments = pathname.split("/");
  const lastSegment = segments[segments.length - 1];
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const project = useSelector(
    (state: RootState) => state.projectDetail.project
  );

  useEffect(() => {
    dispatch(getProjectByCode(params?.code!));
  }, [dispatch, params?.code]);

  const menuItems = [
    {
      key: "planning",
      label: (
        <span>
          <i className="fa-solid fa-map mr-2"></i>Planning
        </span>
      ),
      children: [
        {
          key: "timeline",
          label: (
            <span>
              <i className="fa-solid fa-bars-staggered mr-2"></i>Timeline
            </span>
          ),
        },
        {
          key: "backlog",
          label: (
            <span>
              <i className="fa-solid fa-layer-group mr-2"></i>Backlog
            </span>
          ),
        },
        {
          key: "board",
          label: (
            <span>
              <i className="fa-solid fa-table-columns mr-2"></i>Board
            </span>
          ),
        },
      ],
    },
    {
      key: "development",
      label: (
        <span>
          <i className="fa-solid fa-file-code mr-2"></i>Development
        </span>
      ),
      children: [
        {
          key: "code",
          label: (
            <span>
              <i className="fa-solid fa-code mr-2"></i>Code
            </span>
          ),
        },
      ],
    },
    {
      key: "settings",
      label: (
        <span>
          <i className="fa-solid fa-gear mr-2"></i>Project settings
        </span>
      ),
      children: [
        {
          key: "details",
          label: (
            <span>
              <i className="fa-solid fa-info mr-2"></i>Details
            </span>
          ),
        },
        {
          key: "notifications",
          label: (
            <span>
              <i className="fa-solid fa-bell mr-2"></i>Notifications
            </span>
          ),
        },
        {
          key: "access",
          label: (
            <span>
              <i className="fa-solid fa-universal-access mr-2"></i>Access
            </span>
          ),
        },
        {
          key: "features",
          label: (
            <span>
              <i className="fa-solid fa-elementor mr-2"></i>Features
            </span>
          ),
        },
      ],
    },
  ];
  const renderMenuItems = (items: any) => {
    return items.map((item: any) => {
      if (item.children) {
        return (
          <SubMenu key={item.key} title={item.label}>
            {renderMenuItems(item.children)}
          </SubMenu>
        );
      } else {
        return (
          <Menu.Item key={item.key} onClick={() => onNavigateItem(item.key)}>
            {item.label}
          </Menu.Item>
        );
      }
    });
  };

  const onNavigateItem = (key: string) => {
    navigate(key);
  };
  return (
    <>
      <Layout style={{ backgroundColor: "#fff" }}>
        <Sider width={200}>
          <div
            className="d-flex align-center p-3"
            style={{ backgroundColor: "white" }}
          >
            <img
              src={project?.avatarUrl}
              alt=""
              width="20px"
              height="20px"
              className="mr-2"
            />
            <Tooltip title={project?.name}>
              <h4 className="text-truncate m-0">{project?.name}</h4>
            </Tooltip>
          </div>
          <Menu
            mode="inline"
            defaultOpenKeys={["planning", "development"]}
            selectedKeys={[lastSegment]}
            style={{ height: "100%" }}
          >
            {renderMenuItems(menuItems)}
          </Menu>
        </Sider>
        <Content className="c-content">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/project">Project</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <a>{project?.name!}</a>
            </Breadcrumb.Item>
          </Breadcrumb>
          <Outlet></Outlet>
        </Content>
      </Layout>
    </>
  );
}
