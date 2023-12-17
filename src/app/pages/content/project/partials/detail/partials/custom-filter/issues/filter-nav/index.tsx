import { Menu } from "antd";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CustomFilterIssueNav() {
  const navigate = useNavigate();
  const params = useParams();
  const menuItems = [
    {
      key: "new",
      label: "New search",
    },
    {
      key: "myOpen",
      label: "My open issues",
    },
    {
      key: "reported",
      label: "Reported by me",
    },
    {
      key: "all",
      label: "All issues",
    },
    {
      key: "open",
      label: "Open issues",
    },
    {
      key: "done",
      label: "Done issues",
    },
    {
      key: "stared",
      label: "Stared filter",
    },
  ];

  const onNavigate = (key: string) => {
    navigate(`/issues/${key}`);
  };
  return (
    <>
      <h3 className="ml-4" style={{ color: "#1677FF" }}>
        Filter
      </h3>
      <Menu mode="inline" title="Filter" selectedKeys={[params?.filter!]}>
        {menuItems.map((item) => {
          return (
            <>
              <Menu.Item key={item.key} onClick={() => onNavigate(item.key)}>
                {item.label}
              </Menu.Item>
            </>
          );
        })}
      </Menu>
      ;
    </>
  );
}
