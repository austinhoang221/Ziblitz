import { Menu } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function CustomFilterIssueNav() {
  const navigate = useNavigate();
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
      <h4 className="ml-4">Filter</h4>
      <Menu mode="inline" title="Filter">
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
