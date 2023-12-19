import { Menu, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getFilterIssue } from "../../../../../../../../../../redux/slices/filterSlice";
import { RootState } from "../../../../../../../../../../redux/store";
import { useAppDispatch } from "../../../../../../../../../customHooks/dispatch";

export default function CustomFilterIssueNav() {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { filters, isLoading } = useSelector(
    (state: RootState) => state.filters
  );
  useEffect(() => {
    if (!filters || filters?.length === 0) {
      dispatch(getFilterIssue());
    }
  }, []);

  const onNavigate = (key: string) => {
    navigate(`/issues/${key}`);
  };
  return (
    <>
      <h3 className="ml-4" style={{ color: "#1677FF" }}>
        Filter
      </h3>
      <Menu mode="inline" title="Filter" selectedKeys={[params?.filterId!]}>
        {isLoading ? (
          <>
            <Skeleton.Input active block className="mb-2 mt-2" />
            <Skeleton.Input
              active
              block
              style={{ width: "30%" }}
              className="mb-2"
            />
            <Skeleton.Input
              active
              block
              style={{ width: "30%" }}
              className="mb-2"
            />
            <Skeleton.Input
              active
              block
              style={{ width: "30%" }}
              className="mb-2"
            />
            <Skeleton.Input active block className="mb-2 mt-2" />
            <Skeleton.Input
              active
              block
              style={{ width: "30%" }}
              className="mb-2"
            />
            <Skeleton.Input active block className="mb-2 mt-2" />
            <Skeleton.Input
              active
              block
              style={{ width: "30%" }}
              className="mb-2"
            />
            <Skeleton.Input
              active
              block
              style={{ width: "30%" }}
              className="mb-2"
            />
            <Skeleton.Input
              active
              block
              style={{ width: "30%" }}
              className="mb-2"
            />
          </>
        ) : (
          <>
            <Menu.Item key="new" onClick={() => onNavigate("new")}>
              New search
            </Menu.Item>
            {filters?.map((item) => (
              <Menu.Item key={item.id} onClick={() => onNavigate(item.id)}>
                {item.name}
              </Menu.Item>
            ))}
          </>
        )}
      </Menu>
    </>
  );
}
